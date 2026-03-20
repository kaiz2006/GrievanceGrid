import os
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

try:
    import torch
    import torch.nn.functional as F
    from data_loader import graph_manager
    from model import DepartmentGNN
    HAS_PYG = True
except ImportError:
    HAS_PYG = False
    logger.warning("torch_geometric not installed. Outputting fallback routes.")
    from data_loader import DEFAULT_GRAPH

class GNNRouter:
    def __init__(self):
        self.use_gpu = os.getenv("USE_GPU", "true").lower() == "true"
        self.device = "cuda" if self.use_gpu and HAS_PYG and torch.cuda.is_available() else "cpu"
        self.model_path = os.getenv("GNN_MODEL_PATH", "/app/models/department_gnn.pth")
        
        self.num_features = 10 # 5 severity types + 5 priority levels as a simple feature vector
        self.model = None
        
        if HAS_PYG:
            try:
                # out_channels = 1 because we want a single score (logit) for each department node
                self.model = DepartmentGNN(in_channels=self.num_features, hidden_channels=32, out_channels=1)
                
                if os.path.exists(self.model_path):
                    self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
                    logger.info(f"Loaded GNN Routing model from {self.model_path}")
                else:
                    logger.warning(f"GNN model weights not found at {self.model_path}. Using uninitialized network.")
                    
                self.model = self.model.to(self.device)
                self.model.eval()
            except Exception as e:
                logger.error(f"Failed to load GNN model: {e}")

    def _extract_features(self, grievance: Dict[str, Any]):
        """Convert a JSON grievance into a tensor of node features for the graph.
        In reality, different departments might have different features based on the grievance.
        Here we broadcast the grievance features across all department nodes for the GNN to process.
        """
        # Simple one-hot encoding for demonstration
        priority_map = {"MINOR": 0, "LOW": 1, "MODERATE": 2, "HIGH": 3, "CRITICAL": 4}
        p_idx = priority_map.get(str(grievance.get("priority", "")).upper(), 2)
        
        # We broadcast this feature vector to every department node initially
        features = []
        for i in range(5):
            features.append(1.0 if i == p_idx else 0.0)
        # Pad up to 10
        features.extend([0.0]*5)
        
        # Replicate for all nodes
        num_nodes = graph_manager.num_nodes
        x = [features for _ in range(num_nodes)]
        return torch.tensor(x, dtype=torch.float32).to(self.device)

    def predict_route(self, grievance_payload: Dict[str, Any]) -> tuple[str, List[str]]:
        """Predict optimal department and return top 3 choices."""
        if not HAS_PYG or not self.model:
            # Fallback logic based on category mappings if no GNN is loaded
            return self._fallback_route(grievance_payload)
            
        try:
            x = self._extract_features(grievance_payload)
            pyg_data = graph_manager.get_pyg_data(x)
            if pyg_data is None:
                return self._fallback_route(grievance_payload)
                
            pyg_data = pyg_data.to(self.device)
            
            with torch.no_grad():
                logits = self.model(pyg_data.x, pyg_data.edge_index)
                probs = torch.sigmoid(logits).squeeze(-1)
                
                # Get indices sorted by highest probability
                scores, indices = torch.sort(probs, descending=True)
                
                top_3 = []
                for idx in indices[:3]:
                    top_3.append(graph_manager.id_to_dept[idx.item()])
                    
            if not top_3:
                return self._fallback_route(grievance_payload)
                
            return top_3[0], top_3

        except Exception as e:
            logger.error(f"GNN routing failed: {e}")
            return self._fallback_route(grievance_payload)

    def _fallback_route(self, payload: Dict[str, Any]) -> tuple[str, List[str]]:
        """A simple non-ML fallback based on category text matching."""
        cat = str(payload.get("category", "")).upper()
        
        routes = {
            "ROADS": ["PWD", "TRANSPORT", "SANITATION"],
            "WATER_SUPPLY": ["WATER", "HEALTH", "ENVIRONMENT"],
            "ELECTRICITY": ["ELECTRICITY", "FIRE", "DISASTER"],
            "SANITATION": ["SANITATION", "HEALTH", "WATER"],
            "HEALTH": ["HEALTH", "SANITATION"],
        }
        
        top_departments = routes.get(cat, ["GENERAL", "DISASTER", "POLICE"])
        return top_departments[0], top_departments

router = GNNRouter()
