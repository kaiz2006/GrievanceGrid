from __future__ import annotations

import csv
import os
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
            f"Historical RL dataset not found at {dataset_path}. Set RL_DATASET_PATH to a CSV export."
        )

    with dataset_path.open("r", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        rows = [row for row in reader]
    if not rows:
        raise ValueError(f"Historical RL dataset at {dataset_path} is empty")
    return rows


def train_rl_agent(epochs: int = 20, batch_size: int = 64) -> None:
    dataset_path = Path(
        os.getenv("RL_DATASET_PATH", "ai-models/rl_agent/data/historical_grievances.csv")
    ).resolve()
    rows = _load_historical_dataset(dataset_path)

    observed_departments = sorted(
        {
            str(row.get("department", "")).strip().upper()
            for row in rows
            if str(row.get("department", "")).strip()
        }
    )
    departments = observed_departments if observed_departments else DEFAULT_DEPARTMENTS

    env = GrievanceEnv(departments)
    agent = RoutingRLAgent(state_size=env.state_size, action_size=env.action_size)
    dept_to_idx = {dept: idx for idx, dept in enumerate(departments)}

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

    for epoch in range(epochs):
        for idx, sample in enumerate(prepared):
            state = sample["state"]
            action = int(sample["action"])
            reward = env.get_reward(action, sample["meta"])

            next_state = prepared[(idx + 1) % len(prepared)]["state"]
            done = idx == len(prepared) - 1

            agent.remember(state, action, reward, next_state, done)
            if len(agent.memory) >= batch_size:
                agent.replay(batch_size)

        agent.update_target_model()
        if epoch % 5 == 0:
            print(f"Epoch: {epoch}/{epochs}, Epsilon: {agent.epsilon:.3f}")

    output_path = Path(
        os.getenv("RL_MODEL_OUTPUT_PATH", "ai-models/rl_agent/models/routing_rl_model.pth")
    ).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    agent.save(str(output_path))
    print(f"RL Agent trained from historical dataset and saved to {output_path}")


if __name__ == "__main__":
    train_rl_agent()
