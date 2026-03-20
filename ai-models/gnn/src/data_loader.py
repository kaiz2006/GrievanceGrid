import json
import logging
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

class DepartmentGraphManager:
    def __init__(self):
        self.dept_to_id = {dept: idx for idx, dept in enumerate(DEFAULT_GRAPH.keys())}
        self.id_to_dept = {idx: dept for dept, idx in self.dept_to_id.items()}
        self.num_nodes = len(self.dept_to_id)
        self.edge_index = self._build_edge_index()
        
    def _build_edge_index(self):
        if not HAS_PYG:
            return None
            
        source_nodes = []
        target_nodes = []
        
        for source, targets in DEFAULT_GRAPH.items():
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
