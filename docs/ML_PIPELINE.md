# GrievanceGrid ML Pipeline

## Overview

The ML pipeline processes multi-modal inputs (text, voice, images, geospatial) to power intelligent grievance intake, routing, and predictive analytics.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INPUT SOURCES                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐              │
│  │  Text   │  │  Voice  │  │  Image  │  │ Geospatial│             │
│  └────┬────┘  └────┬────┘  └────┬────┘  └─────┬────┘              │
└───────┼────────────┼────────────┼─────────────┼────────────────────┘
        │            │            │             │
        ▼            ▼            ▼             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PREPROCESSING LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Text Cleaner │  │ Whisper STT  │  │ Image Resize │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MODEL INFERENCE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Llama-3.1    │  │ Whisper Base │  │ ResNet50     │              │
│  │ (Text/Chat)  │  │ (Voice)      │  │ (Vision)     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      OUTPUT PROCESSING                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Category     │  │ Transcript   │  │ Severity     │              │
│  │ Classification│  │ + Intent     │  │ Score 0-1    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Multimodal Transformer (LLM)

### Purpose
Process unstructured text, extract intent, classify category, and suggest resolution.

### Model Configuration
```python
# Configuration for LLM inference
LLM_CONFIG = {
    "model_name": "meta-llama/Llama-3.1-70B-Instruct",
    "quantization": "q4_K_M",        # 4-bit quantization for <100ms inference
    "max_tokens": 512,
    "temperature": 0.3,
    "top_p": 0.9,
    "context_window": 8192,
}
```

### Inference Pipeline

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class GrievanceLLMProcessor:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-70B-Instruct")
        self.model = AutoModelForCausalLM.from_pretrained(
            "meta-llama/Llama-3.1-70B-Instruct",
            torch_dtype=torch.float16,
            device_map="auto",
            load_in_4bit=True
        )
    
    def process_unstructured_text(self, raw_text: str) -> GrievanceAnalysis:
        prompt = f"""Analyze this grievance complaint and extract:
        1. Category (ROADS, WATER_SUPPLY, SANITATION, ELECTRICITY, etc.)
        2. Priority (LOW, MEDIUM, HIGH, CRITICAL)
        3. Summary (2-3 sentence description)
        4. Suggested Department

        Grievance: {raw_text}

        Respond in JSON format."""
        
        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")
        outputs = self.model.generate(**inputs, max_new_tokens=256)
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        return self.parse_llm_response(response)
    
    def suggest_resolution(self, grievance: Grievance) -> List[str]:
        # Query vector DB for similar resolved cases
        similar = qdrant_client.search(
            collection_name="grievances",
            query_vector=grievance.embedding,
            filter={"status": "RESOLVED", "category": grievance.category},
            limit=5
        )
        
        return [hit.payload["resolution_summary"] for hit in similar]
```

### Category Classification Prompt
```python
CATEGORY_PROMPT = """Classify this grievance into ONE of these categories:
- ROADS: Potholes, road damage, traffic signs
- WATER_SUPPLY: Leakage, no water, contamination
- SANITATION: Garbage, sewage, drainage
- ELECTRICITY: Power outage, fallen wires
- PUBLIC_TRANSPORT: Bus issues, routes, stops
- ENVIRONMENT: Pollution, noise
- BUILDING_VIOLATION: Illegal construction
- OTHER: None of the above

Text: {input_text}
Category:"""
```

---

## 2. Computer Vision (Damage Assessment)

### Purpose
Analyze "Before" photos to estimate damage severity automatically.

### Model Architecture
```python
import torch
import torch.nn as nn
from torchvision import models

class DamageSeverityClassifier(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()
        # Fine-tuned ResNet50 backbone
        self.backbone = models.resnet50(pretrained=True)
        self.backbone.fc = nn.Linear(2048, 512)
        self.classifier = nn.Sequential(
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)  # 0-4 severity scale
        )
    
    def forward(self, x):
        features = self.backbone(x)
        return self.classifier(features)

class DamageSeverityEstimator:
    def __init__(self, model_path: str):
        self.model = DamageSeverityClassifier()
        self.model.load_state_dict(torch.load(model_path))
        self.model.eval()
        
        self.class_labels = {
            0: "MINOR",      // <10cm diameter
            1: "LOW",        // 10-30cm
            2: "MODERATE",   // 30-50cm
            3: "SEVERE",     // 50-100cm
            4: "CRITICAL"   // >100cm or unsafe
        }
    
    def estimate(self, image_path: str) -> float:
        image = Image.open(image_path).convert("RGB")
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        tensor = transform(image).unsqueeze(0)
        with torch.no_grad():
            logits = self.model(tensor)
            probabilities = torch.softmax(logits, dim=1)
            severity = torch.sum(probabilities * torch.arange(5, device="cuda"))
        
        return severity.item() / 4.0  # Normalize to 0-1
```

### Training Data Requirements
- **Images**: 50,000+ labeled damage photos
- **Labels**: Severity 0-4 with bounding boxes
- **Categories**: Potholes, cracks, leaks, damage types

---

## 3. Voice-to-Grid (Speech-to-Text)

### Purpose
Convert voice notes from digital-illiterate users into structured grievances.

### Implementation
```python
import whisper

class VoiceProcessor:
    def __init__(self, model_size="base"):
        self.model = whisper.load_model(model_size)
    
    def transcribe(self, audio_path: str, language: str = "hi") -> TranscriptResult:
        # language: hi (Hindi), ta (Tamil), te (Telugu), etc.
        result = self.model.transcribe(
            audio_path,
            language=language,
            fp16=False,
            condition_on_previous_text=False
        )
        
        return TranscriptResult(
            text=result["text"],
            language=result["language"],
            segments=result["segments"],
            confidence=result.get("avg_logprob", -1.0)
        )

# Regional language support
REGIONAL_LANGUAGES = {
    "hi": "Hindi",
    "ta": "Tamil",
    "te": "Telugu",
    "bn": "Bengali",
    "mr": "Marathi",
    "kn": "Kannada",
    "ml": "Malayalam",
    "gu": "Gujarati",
    "pa": "Punjabi",
    "or": "Odia"
}
```

### Voice Bot Flow
```
User calls → IVR → Record message → Whisper → LLM process → Create Grievance → Return Grid ID via TTS
```

---

## 4. Graph Neural Network (Routing)

### Purpose
Predict optimal routing path through department dependencies.

### GNN Architecture
```python
import torch
import torch.nn as nn
from torch_geometric.nn import GCNConv, GATConv

class DepartmentGNN(nn.Module):
    def __init__(self, num_nodes, hidden_dim=128):
        super().__init__()
        self.node_embeddings = nn.Embedding(num_nodes, hidden_dim)
        
        # Graph attention layers
        self.conv1 = GATConv(hidden_dim, hidden_dim, heads=4)
        self.conv2 = GATConv(hidden_dim * 4, hidden_dim, heads=1)
        
        # Edge classification for routing
        self.router = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1),
            nn.Sigmoid()
        )
    
    def forward(self, edge_index, node_features):
        x = self.node_embeddings(torch.arange(self.node_embeddings.num_embeddings))
        x = self.conv1(x, edge_index)
        x = torch.relu(x)
        x = self.conv2(x, edge_index)
        return x
    
    def predict_route(self, source_dept: int, grievance_features: torch.Tensor):
        """Predict next best department to route to"""
        # Get source node embedding
        source_emb = self.node_embeddings(source_dept)
        
        # Combine with grievance features
        combined = torch.cat([source_emb, grievance_features], dim=-1)
        
        # Score all possible next departments
        scores = []
        for target_dept in range(self.num_nodes):
            if target_dept != source_dept:
                target_emb = self.node_embeddings(target_dept)
                pair_features = torch.cat([combined, target_emb])
                score = self.router(pair_features)
                scores.append((target_dept, score))
        
        return sorted(scores, key=lambda x: x[1], reverse=True)[:3]
```

### Department Dependency Graph
```python
DEPARTMENT_GRAPH = {
    "PWD": ["ELECTRICITY", "TRANSPORT"],           # Road damage may involve utility cuts
    "WATER": ["SANITATION", "HEALTH"],             # Water leaks affect sanitation
    "ELECTRICITY": ["FIRE", "DISASTER"],            // Downed wires are emergency
    "SANITATION": ["ENVIRONMENT", "HEALTH"],       // Waste affects health
    "TRANSPORT": ["PWD", "POLICE"],                // Traffic signs need road work
}
```

---

## 5. Geospatial Clustering (DBSCAN + LDA)

### Purpose
Detect complaint clusters and identify emerging crises.

### DBSCAN Implementation
```python
from sklearn.cluster import DBSCAN
import numpy as np

class GeoClusteringService:
    def __init__(self):
        self.dbscan = DBSCAN(
            eps=500,           # 500 meters
            min_samples=5,     # Minimum 5 complaints
            metric="haversine"
        )
    
    def detect_clusters(self, grievances: List[Grievance]) -> List[GeoCluster]:
        # Prepare coordinates in radians
        coords = np.radians([[g.latitude, g.longitude] for g in grievances])
        
        # Run DBSCAN
        labels = self.dbscan.fit_predict(coords)
        
        # Group by cluster
        clusters = {}
        for i, label in enumerate(labels):
            if label == -1:  # Noise
                continue
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(grievances[i])
        
        # Convert to cluster objects
        return [self.create_cluster(label, members) for label, members in clusters.items()]
    
    def calculate_crisis_score(self, cluster: GeoCluster) -> float:
        """Calculate urgency score based on:
        - Density (complaints per sq km)
        - Category severity
        - Time concentration
        """
        density_score = min(cluster.grievance_count / 50, 1.0)
        
        # High-priority categories increase crisis score
        severity_multiplier = {
            "CRITICAL": 1.5,
            "HIGH": 1.2,
            "MEDIUM": 1.0,
            "LOW": 0.8
        }
        
        return min(density_score * 1.2, 1.0)
```

### LDA Topic Modeling
```python
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer

class TopicAnalysisService:
    def __init__(self):
        self.vectorizer = CountVectorizer(max_df=0.95, min_df=2, max_features=1000)
        self.lda = LatentDirichletAllocation(n_components=5, random_state=42)
    
    def extract_topics(self, grievance_descriptions: List[str]) -> Dict[str, List[str]]:
        # Vectorize text
        X = self.vectorizer.fit_transform(grievance_descriptions)
        
        # Fit LDA
        self.lda.fit(X)
        
        # Extract keywords per topic
        feature_names = self.vectorizer.get_feature_names_out()
        topics = {}
        for idx, topic in enumerate(self.lda.components_):
            top_words = [feature_names[i] for i in topic.argsort()[:-10:]]
            topics[f"topic_{idx}"] = top_words
        
        return topics
```

---

## 6. Predictive Maintenance Engine

### Purpose
Forecast infrastructure failures based on complaint patterns.

### Model Architecture
```python
from sklearn.ensemble import RandomForestRegressor
import pandas as pd

class PredictiveMaintenanceEngine:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
    
    def predict_failure(self, asset_id: str, days_ahead: int = 7) -> PredictionResult:
        # Get historical complaint data for asset
        features = self.extract_features(asset_id)
        
        # Predict failure probability
        probability = self.model.predict_proba([features])[0, 1]
        
        return PredictionResult(
            asset_id=asset_id,
            failure_probability=probability,
            confidence=0.85,
            predicted_failure_date=datetime.now() + timedelta(days=days_ahead),
            contributing_factors=self.explain_prediction(features)
        )
    
    def extract_features(self, asset_id: str) -> List[float]:
        """Extract features for ML model:
        - Complaint count (7-day, 30-day, 90-day)
        - Complaint severity average
        - Time since last complaint
        - Seasonal patterns
        - Similar asset failure rate
        """
        # Query from PostgreSQL
        query = """
        SELECT 
            COUNT(*) as total_complaints,
            AVG(severity) as avg_severity,
            MIN(created_at) as first_complaint,
            MAX(created_at) as last_complaint
        FROM grievances
        WHERE asset_id = %s
        AND created_at > NOW() - INTERVAL '90 days'
        """
        
        # Additional feature engineering...
        return features
```

---

## 7. Reinforcement Learning (Continuous Improvement)

### Purpose
Optimize routing and priority models based on real outcomes.

### RL Architecture
```python
import numpy as np

class RoutingRLAgent:
    def __init__(self, state_dim=64, action_dim=10):
        self.q_network = QNetwork(state_dim, action_dim)
        self.optimizer = torch.optim.Adam(self.q_network.parameters(), lr=0.001)
        
    def get_action(self, state: GrievanceState) -> int:
        # Epsilon-greedy exploration
        if np.random.random() < self.epsilon:
            return np.random.randint(self.action_dim)
        
        with torch.no_grad():
            q_values = self.q_network(state.to_tensor())
            return torch.argmax(q_values).item()
    
    def update(self, state, action, reward, next_state):
        # Q-learning update
        current_q = self.q_network(state)[action]
        target_q = reward + self.gamma * torch.max(self.q_network(next_state))
        
        loss = (current_q - target_q) ** 2
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

# Reward function
def calculate_reward(grievance: Grievance, resolution_time: int) -> float:
    # Positive: Resolution within SLA, citizen satisfaction
    # Negative: Missed SLA, escalation, contestation
    
    base_reward = 100
    
    if resolution_time <= grievance.sla_resolution_hours * 3600:
        base_reward += 50
    
    if grievance.citizen_satisfaction >= 4:
        base_reward += 30
    
    if grievance.status == "ESCALATED":
        base_reward -= 40
    
    if grievance.status == "CONTESTED":
        base_reward -= 60
    
    return base_reward
```

---

## 8. Vector Embeddings (Qdrant Integration)

### Purpose
Enable semantic similarity search for case matching.

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

class VectorStore:
    def __init__(self):
        self.client = QdrantClient(host="qdrant", port=6333)
        
        self.client.recreate_collection(
            collection_name="grievances",
            vectors_config=VectorParams(
                size=768,  # BERT dimension
                distance=Distance.COSINE
            )
        )
    
    def index_grievance(self, grievance: Grievance):
        # Generate BERT embedding
        embedding = self.get_bert_embedding(grievance.description)
        
        self.client.upsert(
            collection_name="grievances",
            points=[{
                "id": grievance.grid_id,
                "vector": embedding,
                "payload": {
                    "category": grievance.category,
                    "status": grievance.status,
                    "resolution": grievance.resolution_summary,
                    "priority": grievance.priority
                }
            }]
        )
    
    def find_similar(self, query: str, category: str = None, limit: int = 5):
        query_embedding = self.get_bert_embedding(query)
        
        filters = {"status": "RESOLVED"}
        if category:
            filters["category"] = category
        
        results = self.client.search(
            collection_name="grievances",
            query_vector=query_embedding,
            query_filter=filters,
            limit=limit
        )
        
        return results
```

---

## Pipeline Orchestration

```python
# Celery tasks for async processing
@celery.task
def process_grievance_ai(grievance_id: str):
    grievance = db.get(Grievance, grievance_id)
    
    # 1. Process text/voice with LLM
    if grievance.raw_input:
        llm_result = llm_processor.process_unstructured_text(grievance.raw_input)
        grievance.ai_category = llm_result.category
        grievance.ai_priority = llm_result.priority
    
    # 2. Analyze image with CV
    if grievance.before_photo_url:
        severity = cv_model.estimate(grievance.before_photo_url)
        grievance.damage_severity = severity
    
    # 3. Generate embedding for similarity search
    embedding = get_bert_embedding(grievance.description)
    vector_store.index_grievance(grievance, embedding)
    
    # 4. Route via GNN
    route = gnn_router.predict_route(grievance)
    grievance.assigned_department = route.best_department
    
    db.save(grievance)
```

---

## Performance Targets

| Model | Latency | Accuracy |
|-------|---------|----------|
| LLM (Llama-3.1) | <100ms | >90% category match |
| CV (ResNet50) | <200ms | >85% severity accuracy |
| Whisper STT | <500ms | >95% transcription accuracy |
| GNN Routing | <30ms | >80% optimal route |
| DBSCAN | <1s | Real-time clustering |
| Vector Search | <50ms | Top-5 similar cases |