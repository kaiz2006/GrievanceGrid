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

    def __init__(self):
        self.use_gpu = os.getenv("USE_GPU", "true").lower() == "true"
        self.app_env = os.getenv("APP_ENV", "development").lower()
        self.strict_startup = os.getenv("STRICT_MODEL_STARTUP", "true").lower() in {"1", "true", "yes", "on"}
        can_use_cuda = bool(HAS_PYG and "torch" in globals() and torch.cuda.is_available())
        self.device = "cuda" if self.use_gpu and can_use_cuda else "cpu"
        self.model_path = os.getenv("GNN_MODEL_PATH", "/app/models/department_gnn.pth")
        
        # Internal search if not found at default env path
        if not os.path.exists(self.model_path):
             local_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "department_gnn.pth")
             if os.path.exists(local_path):
                 self.model_path = local_path

        self.num_features = 10 # 5 severity types + 5 priority levels as a simple feature vector
        self.model = None

        if (self.strict_startup or self.app_env in {"production", "staging"}) and not HAS_PYG:
            raise RuntimeError("❌ torch_geometric is REQUIRED for real GNN routing. Install it.")

        if not HAS_PYG:
            logger.error("torch_geometric not found. GNN routing service cannot function.")
            return

        try:
            # out_channels = 1 because we want a single score (logit) for each department node
            self.model = DepartmentGNN(in_channels=self.num_features, hidden_channels=32, out_channels=1)
            
            if os.path.exists(self.model_path):
                self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
                logger.info(f"✅ Loaded REAL GNN Routing model from {self.model_path}")
            else:
                msg = f"❌ CRITICAL: GNN model weights not found at {self.model_path}. Fake-free mode requires real weights."
                logger.error(msg)
                if self.strict_startup:
                    raise FileNotFoundError(msg)
                self.model = None
                return
                
            self.model = self.model.to(self.device)
            self.model.eval()
        except Exception as e:
            logger.error(f"Failed to load GNN model: {e}")
            if self.strict_startup:
                raise

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
             raise RuntimeError("GNN model or PyG library not available. Routing impossible in fake-free mode.")
            
        try:
            x = self._extract_features(grievance_payload)
            pyg_data = graph_manager.get_pyg_data(x)
            if pyg_data is None:
                raise ValueError("Graph manager could not generate PyG data object.")
                
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
                raise ValueError("GNN inference returned empty department list.")
                
            return top_3[0], top_3

        except Exception as e:
            logger.error(f"GNN routing failed: {e}")
            raise

router = GNNRouter()
