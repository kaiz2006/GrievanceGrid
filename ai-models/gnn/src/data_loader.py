import json
import logging
import os
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)

try:
    import torch
    from torch_geometric.data import Data
    HAS_PYG = True
except ImportError:
    HAS_PYG = False
    logger.warning("torch_geometric not installed. Falling back to stub.")

# Hardcoded graph as fallback if json isn't present
DEFAULT_GRAPH = {
    "PWD": ["ELECTRICITY", "TRANSPORT"],
    "WATER": ["SANITATION", "HEALTH", "PWD"],
    "ELECTRICITY": ["FIRE", "DISASTER"],
    "SANITATION": ["ENVIRONMENT", "HEALTH"],
    "TRANSPORT": ["PWD", "POLICE"],
    "HEALTH": ["SANITATION"],
    "POLICE": ["TRANSPORT"],
    "FIRE": ["DISASTER", "POLICE"],
    "DISASTER": ["FIRE", "HEALTH"],
    "ENVIRONMENT": ["SANITATION"]
}


def _load_graph() -> Dict[str, list[str]]:
    app_env = os.getenv("APP_ENV", "development").lower()
    strict_startup = os.getenv("STRICT_MODEL_STARTUP", "false").lower() in {"1", "true", "yes", "on"}
    graph_path = Path(
        os.getenv(
            "DEPARTMENT_GRAPH_PATH",
            str((Path(__file__).resolve().parents[1] / "data" / "department_graph.json").resolve()),
        )
    )

    if graph_path.exists():
        try:
            with graph_path.open("r", encoding="utf-8") as handle:
                loaded = json.load(handle)
            if isinstance(loaded, dict) and loaded:
                normalized: Dict[str, list[str]] = {}
                for key, value in loaded.items():
                    if isinstance(value, list):
                        normalized[str(key).upper()] = [str(item).upper() for item in value]
                if normalized:
                    return normalized
        except Exception as exc:
            logger.error("Failed to load department graph file", extra={"error": str(exc)})

    if strict_startup or app_env in {"production", "staging"}:
        raise RuntimeError(f"Required GNN graph artifact missing or invalid: {graph_path}")

    logger.warning("Using DEFAULT_GRAPH fallback because graph artifact was unavailable")
    return DEFAULT_GRAPH


GRAPH_DATA = _load_graph()

class DepartmentGraphManager:
    def __init__(self):
        self.dept_to_id = {dept: idx for idx, dept in enumerate(GRAPH_DATA.keys())}
        self.id_to_dept = {idx: dept for dept, idx in self.dept_to_id.items()}
        self.num_nodes = len(self.dept_to_id)
        self.edge_index = self._build_edge_index()
        
    def _build_edge_index(self):
        if not HAS_PYG:
            return None
            
        source_nodes = []
        target_nodes = []
        
        for source, targets in GRAPH_DATA.items():
            if source not in self.dept_to_id:
                continue
            src_id = self.dept_to_id[source]
            for target in targets:
                if target in self.dept_to_id:
                    tgt_id = self.dept_to_id[target]
                    source_nodes.append(src_id)
                    target_nodes.append(tgt_id)
                    # Assuming bidirectional info flow for routing
                    source_nodes.append(tgt_id)
                    target_nodes.append(src_id)
                    
        return torch.tensor([source_nodes, target_nodes], dtype=torch.long)

    def get_pyg_data(self, node_features):
        """Build a PyG Data object given node features."""
        if not HAS_PYG:
            return None
        return Data(x=node_features, edge_index=self.edge_index)

graph_manager = DepartmentGraphManager()
