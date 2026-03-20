import os
import io
import urllib.request
import logging
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)

try:
    import torch
    import torch.nn as nn
    from torchvision import models, transforms
    from PIL import Image
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False
    logger.warning("torch/torchvision not installed. Falling back to stub CV model.")

class DamageSeverityEstimator:
    def __init__(self):
        self.use_gpu = os.getenv("USE_GPU", "true").lower() == "true"
        self.app_env = os.getenv("APP_ENV", "development").lower()
        self.strict_startup = os.getenv("STRICT_MODEL_STARTUP", "false").lower() in {"1", "true", "yes", "on"}
        self.device = "cuda" if self.use_gpu and HAS_TORCH and torch.cuda.is_available() else "cpu"
        self.model_path = os.getenv("CV_MODEL_PATH", "/app/models/damage_classifier.pth")
        self.model = None

        if (self.strict_startup or self.app_env in {"production", "staging"}) and not HAS_TORCH:
            raise RuntimeError("Torch dependencies are required in strict startup mode")

        if (self.strict_startup or self.app_env in {"production", "staging"}) and not Path(self.model_path).exists():
            raise RuntimeError(f"Required CV model artifact missing: {self.model_path}")

        if HAS_TORCH:
            try:
                # Load a standard ResNet50 as a backbone mapping to 5 classes (0-4 severity)
                self.model = models.resnet50(weights=None)
                num_ftrs = self.model.fc.in_features
                self.model.fc = nn.Linear(num_ftrs, 5)
                
                if os.path.exists(self.model_path):
                    self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
                    logger.info(f"Loaded CV model from {self.model_path}")
                else:
                    logger.warning(f"CV model weights not found at {self.model_path}. Using untrained ResNet50 (results will be random).")
                
                self.model = self.model.to(self.device)
                self.model.eval()
                
                self.transform = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
                ])
                
            except Exception as e:
                logger.error(f"Failed to load CV model: {e}")
                self.model = None

    def _load_image(self, image_url_or_path: str):
        if image_url_or_path.startswith("http://") or image_url_or_path.startswith("https://"):
            req = urllib.request.Request(image_url_or_path, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as response:
                image_data = response.read()
            return Image.open(io.BytesIO(image_data)).convert("RGB")
        return Image.open(image_url_or_path).convert("RGB")

    def _heuristic_severity(self, image_url_or_path: str) -> float:
        """Use deterministic visual heuristics when model weights are not available."""
        if not HAS_TORCH:
            return 0.5
        try:
            image = self._load_image(image_url_or_path)
            gray = image.convert("L")
            arr = torch.tensor(list(gray.getdata()), dtype=torch.float32).reshape(gray.size[1], gray.size[0]) / 255.0
            contrast = float(arr.std().item())
            vertical_edges = torch.abs(arr[:, 1:] - arr[:, :-1]).mean().item()
            horizontal_edges = torch.abs(arr[1:, :] - arr[:-1, :]).mean().item()
            edge_score = float((vertical_edges + horizontal_edges) / 2.0)
            darkness = float((arr < 0.25).float().mean().item())

            score = 0.55 * edge_score + 0.30 * contrast + 0.15 * darkness
            return round(max(0.0, min(1.0, score * 2.0)), 3)
        except Exception as exc:
            logger.error(f"Heuristic severity estimation failed: {exc}")
            return 0.5

    def estimate_severity(self, image_url_or_path: str) -> float:
        """Estimate severity between 0.0 (No damage) and 1.0 (Critical)."""
        if not self.model:
            logger.warning("CV model missing. Falling back to heuristic severity score.")
            return self._heuristic_severity(image_url_or_path)

        try:
            image = self._load_image(image_url_or_path)

            # Preprocess
            input_tensor = self.transform(image).unsqueeze(0).to(self.device)

            # Inference
            with torch.no_grad():
                outputs = self.model(input_tensor)
                # Apply softmax to get probabilities
                probs = torch.nn.functional.softmax(outputs, dim=1)[0]
                
                # Calculate expected value of severity (classes 0, 1, 2, 3, 4)
                # Then normalize to 0.0 - 1.0
                expected_severity = sum(i * prob.item() for i, prob in enumerate(probs))
                normalized_score = expected_severity / 4.0
                
            return round(normalized_score, 3)

        except Exception as e:
            logger.error(f"Severity estimation failed: {e}")
            return self._heuristic_severity(image_url_or_path)

estimator = DamageSeverityEstimator()
