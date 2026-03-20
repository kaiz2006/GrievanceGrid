import os
import io
import urllib.request
import logging
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
        self.device = "cuda" if self.use_gpu and HAS_TORCH and torch.cuda.is_available() else "cpu"
        self.model_path = os.getenv("CV_MODEL_PATH", "/app/models/damage_classifier.pth")
        self.model = None

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

    def estimate_severity(self, image_url_or_path: str) -> float:
        """Estimate severity between 0.0 (No damage) and 1.0 (Critical)."""
        if not self.model:
            # Fallback stub for development if torch isn't installed
            logger.warning("CV model missing. Returning stub severity score.")
            return 0.5
            
        try:
            # Handle URLs vs local paths
            if image_url_or_path.startswith("http://") or image_url_or_path.startswith("https://"):
                req = urllib.request.Request(image_url_or_path, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response:
                    image_data = response.read()
                image = Image.open(io.BytesIO(image_data)).convert('RGB')
            else:
                image = Image.open(image_url_or_path).convert('RGB')

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
            return 0.5 # Return a safe middle fallback score

estimator = DamageSeverityEstimator()
