from __future__ import annotations

import torch
import csv
import os
import random
from pathlib import Path
from typing import Any

import numpy as np

from agent import RoutingRLAgent
from environment import GrievanceEnv


DEFAULT_DEPARTMENTS = [
    "PWD",
    "ELECTRICITY",
    "TRANSPORT",
    "WATER",
    "SANITATION",
    "HEALTH",
    "POLICE",
    "FIRE",
    "DISASTER",
    "ENVIRONMENT",
]


def _to_bool(value: Any) -> bool:
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def _priority_index(priority: str) -> int:
    mapping = {"MINOR": 0, "LOW": 1, "MODERATE": 2, "HIGH": 3, "CRITICAL": 4}
    return mapping.get(str(priority).upper(), 2)


def _state_from_row(row: dict[str, Any], size: int) -> np.ndarray:
    # Priority one-hot + 5 operational signals.
    vector = np.zeros(size, dtype=np.float32)
    p_idx = _priority_index(str(row.get("priority", "MODERATE")))
    if p_idx < size:
        vector[p_idx] = 1.0

    signals = [
        1.0 if _to_bool(row.get("resolved_within_sla")) else 0.0,
        float(row.get("satisfaction_score", 0.0)) / 5.0,
        1.0 if _to_bool(row.get("is_escalated")) else 0.0,
        1.0 if _to_bool(row.get("is_contested")) else 0.0,
        min(1.0, float(row.get("resolution_hours", 0.0)) / 72.0),
    ]

    for idx, value in enumerate(signals, start=5):
        if idx >= size:
            break
        vector[idx] = float(value)

    return vector


def _load_historical_dataset(dataset_path: Path) -> list[dict[str, Any]]:
    if not dataset_path.exists():
        raise FileNotFoundError(
            f"Historical RL dataset not found at {dataset_path}. Run build_rl_dataset.py first."
        )

    with dataset_path.open("r", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        rows = [row for row in reader]
    if not rows:
        raise ValueError(f"Historical RL dataset at {dataset_path} is empty")
    return rows


def train_rl_agent(epochs: int = 20, batch_size: int = 64, limit: int | None = None) -> None:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    # Resolve paths relative to script
    script_dir = Path(__file__).parent.resolve()
    default_dataset = script_dir.parent / "data" / "historical_grievances.csv"
    
    dataset_path = Path(os.getenv("RL_DATASET_PATH", str(default_dataset))).resolve()
    print(f"Loading RL data from {dataset_path}...")
    rows = _load_historical_dataset(dataset_path)

    if limit:
        print(f"Limiting dataset to first {limit} rows.")
        rows = rows[:limit]

    observed_departments = sorted(
        {
            str(row.get("department", "")).strip().upper()
            for row in rows
            if str(row.get("department", "")).strip()
        }
    )
    departments = observed_departments if observed_departments else DEFAULT_DEPARTMENTS

    env = GrievanceEnv(departments)
    agent = RoutingRLAgent(state_size=env.state_size, action_size=env.action_size, device=device)
    dept_to_idx = {dept: idx for idx, dept in enumerate(departments)}

    print("Preparing dataset...")
    prepared = [
        {
            "state": _state_from_row(row, env.state_size),
            "action": dept_to_idx.get(str(row.get("department", "")).strip().upper(), 0),
            "meta": {
                "resolved_within_sla": _to_bool(row.get("resolved_within_sla")),
                "satisfaction_score": float(row.get("satisfaction_score", 0) or 0),
                "is_escalated": _to_bool(row.get("is_escalated")),
                "is_contested": _to_bool(row.get("is_contested")),
            },
        }
        for row in rows
    ]

    update_freq = 1
    target_update_freq = 1000

    print("Converting dataset to tensors (this will save hours of training time)...")
    all_states = torch.FloatTensor(np.array([s["state"] for s in prepared])).to(device)
    all_actions = torch.LongTensor([s["action"] for s in prepared]).to(device)
    all_rewards = torch.FloatTensor([env.get_reward(s["action"], s["meta"]) for s in prepared]).to(device)
    all_next_states = torch.roll(all_states, -1, dims=0)
    all_dones = torch.zeros(len(prepared)).to(device)
    all_dones[-1] = 1.0

    print(f"Starting optimized training for {epochs} epochs...")
    num_samples = len(prepared)
    for epoch in range(epochs):
        indices = torch.randperm(num_samples)
        total_loss = 0
        batch_count = 0
        
        for i in range(0, num_samples, batch_size):
            batch_idx = indices[i : i + batch_size]
            if len(batch_idx) < batch_size:
                continue
                
            loss = agent.train_step(
                all_states[batch_idx],
                all_actions[batch_idx],
                all_rewards[batch_idx],
                all_next_states[batch_idx],
                all_dones[batch_idx]
            )
            total_loss += loss
            batch_count += 1
            
            if (i // batch_size) % 100 == 0:
                print(f"  Epoch {epoch+1} Progress: {i}/{num_samples} ({(i/num_samples*100):.1f}%)", end="\r")

        if epoch % 10 == 0 or epoch == epochs - 1:
            agent.update_target_model()

        avg_loss = total_loss / batch_count if batch_count > 0 else 0
        print(f"Epoch: {epoch+1}/{epochs}, Avg Loss: {avg_loss:.4f}, Epsilon: {agent.epsilon:.3f}")

    output_dir = script_dir.parent / "models"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "routing_rl_model.pth"
    
    agent.save(str(output_path))
    print(f"RL Agent trained and saved to {output_path}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Train the RL routing agent.")
    parser.add_argument("--epochs", type=int, default=100, help="Number of epochs to train.")
    parser.add_argument("--batch-size", type=int, default=64, help="Batch size for replay.")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of dataset rows.")
    args = parser.parse_args()
    
    train_rl_agent(epochs=args.epochs, batch_size=args.batch_size, limit=args.limit)
