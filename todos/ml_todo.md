# ML Todo (ai-models/)

## ✅ Integration Progress (implemented in apps/worker)
- [x] Worker now orchestrates model-service HTTP calls for text classification, voice transcription, CV severity, and route prediction
- [x] Worker now includes Qdrant integration client and upserts grievance embeddings directly from Celery tasks
- [x] Worker now uses deterministic embedding/risk fallbacks to keep pipeline resilient when ML services are unavailable
- [x] `Add FastAPI endpoint or use Qdrant client directly from Celery worker` completed via direct Qdrant client usage in worker
- [ ] Move these integration helpers into `ai-models/` service implementations and align endpoint contracts end-to-end

## 🗂️ Project Setup
- [ ] Set up `ai-models/` Dockerfiles for each model service (llm, cv, gnn, clustering)
- [ ] Configure CUDA / GPU access in Docker containers
- [ ] Create shared `ai-models/.env` with `MODEL_PATH`, `CUDA_DEVICE`
- [ ] Create base `requirements.txt` for common ML deps (torch, transformers, numpy, scikit-learn, qdrant-client)
- [ ] Set up model weight storage directory (`/models`) with volume mounts

---

## 🤖 1. Multimodal LLM (ai-models/llm)
**Target: <100ms inference, >90% category accuracy**

- [ ] Set up VLLM server (`ai-models/llm/src/client.py`) as HTTP wrapper
- [ ] Implement `GrievanceLLMProcessor` class (`processor.py`):
  - Load `meta-llama/Llama-3.1-70B-Instruct` with 4-bit quantization (`q4_K_M`)
  - `process_unstructured_text()` — extract category, priority, summary, department in JSON
  - `suggest_resolution()` — query Qdrant for similar resolved cases, return solution list
- [ ] Write `prompts/classification.md` with `CATEGORY_PROMPT` for all 8 categories
- [ ] Write `prompts/routing.md` for department suggestion prompt
- [ ] Write `prompts/resolution.md` for resolution suggestion prompt
- [ ] Write `config.py` with `LLM_CONFIG` (model name, tokens, temperature, context window)
- [ ] Add FastAPI inference server with `POST /process-text` endpoint
- [ ] Benchmark: verify <100ms P95 latency
- [ ] Dockerize and expose on internal network

---

## 👁️ 2. Computer Vision — Damage Assessment (ai-models/cv)
**Target: <200ms inference, >85% severity accuracy**

- [ ] Implement `DamageSeverityClassifier` (ResNet50 backbone fine-tuned for 5 severity classes)
- [ ] Implement `DamageSeverityEstimator` class (`inference.py`):
  - Load `.pth` weights from `models/damage_classifier.pth`
  - Pre-process: resize to 224×224, normalize with ImageNet stats
  - Return severity score normalized to 0–1
  - Map to labels: MINOR, LOW, MODERATE, SEVERE, CRITICAL
- [ ] Add FastAPI inference server with `POST /estimate-severity` endpoint (accepts image file)
- [ ] Write training scripts in `src/training/`:
  - [ ] Data loader for labeled damage photos
  - [ ] Training loop with validation and early stopping
  - [ ] Checkpoint saving and best-model export
- [ ] **Data**: Source / label 50,000+ damage photos with severity 0–4 (potholes, cracks, leaks)
- [ ] Benchmark: verify <200ms P95 latency, >85% accuracy on test set
- [ ] Dockerize and expose on internal network

---

## 🎤 3. Voice-to-Grid — Speech-to-Text (ai-models/llm or separate service)
**Target: <500ms inference, >95% transcription accuracy**

- [ ] Implement `VoiceProcessor` class using OpenAI Whisper (`base` model):
  - `transcribe()` — accept audio path + language code, return `TranscriptResult`
  - Support regional language codes: `hi`, `ta`, `te`, `bn`, `mr`, `kn`, `ml`, `gu`, `pa`, `or`
- [ ] Build Voice Bot flow:
  - [ ] Audio preprocessing (convert mp3 to wav, normalize volume)
  - [ ] Language detection fallback if language not specified
  - [ ] Pass transcript to LLM for structured grievance extraction
  - [ ] Return Grid ID via TTS (Text-to-Speech) response
- [ ] Add FastAPI inference server with `POST /transcribe` endpoint (multipart audio)
- [ ] Benchmark: verify <500ms P95 latency

---

## 🕸️ 4. Graph Neural Network — Routing (ai-models/gnn)
**Target: <30ms inference, >80% optimal route accuracy**

- [ ] Implement `DepartmentGNN` model (`model.py`):
  - Node embeddings for each department
  - 2-layer Graph Attention Network (GATConv)
  - Edge classifier / router head with Sigmoid activation
- [ ] Build department dependency graph (`data/department_graph.json`):
  - PWD → [ELECTRICITY, TRANSPORT]
  - WATER → [SANITATION, HEALTH]
  - ELECTRICITY → [FIRE, DISASTER]
  - SANITATION → [ENVIRONMENT, HEALTH]
  - TRANSPORT → [PWD, POLICE]
- [ ] Implement `data_loader.py` — construct PyG graph from department graph JSON
- [ ] Implement `trainer.py` — training loop with routing accuracy metric
- [ ] Implement `inference.py` — `predict_route(source_dept, grievance_features)` returning top-3 departments
- [ ] Add FastAPI inference server with `POST /predict-route` endpoint
- [ ] Save trained weights to `models/department_gnn.pth`
- [ ] Benchmark: verify <30ms P95 latency

---

## 🗺️ 5. Geospatial Clustering — DBSCAN + LDA (ai-models/clustering)

- [ ] Implement `GeoClusteringService` (`dbscan.py`):
  - DBSCAN with `eps=500m`, `min_samples=5`, `metric=haversine`
  - `detect_clusters()` — converts grievance coordinates to radians and runs DBSCAN
  - `calculate_crisis_score()` — density score × severity multiplier (CRITICAL: 1.5x, HIGH: 1.2x, etc.)
  - Returns `GeoCluster` objects with centroid, count, density, and crisis score
- [ ] Implement `TopicAnalysisService` (`lda.py`):
  - LDA with 5 topics, `CountVectorizer` with 1000 features
  - `extract_topics()` — returns top-10 keywords per topic
  - Used to label clusters with human-readable topic keywords
- [ ] Implement anomaly detection (`anomaly.py`):
  - Flag grievances that don't match any cluster but show unusual patterns
- [ ] Create Jupyter notebook for exploratory analysis (`notebooks/`)
- [ ] Expose as callable Python module (imported by Celery worker, not a separate server)

---

## 🔮 6. Predictive Maintenance Engine (ai-models/clustering or separate)

- [ ] Implement `PredictiveMaintenanceEngine`:
  - `RandomForestRegressor` (100 trees, max_depth=10)
  - `extract_features()` — query PostgreSQL for complaint count (7/30/90-day), avg severity, time since last complaint, seasonal patterns
  - `predict_failure()` — returns failure probability + predicted date (7-day horizon)
  - Explain prediction with feature importances
- [ ] Train model on historical complaint data per asset
- [ ] Update `infrastructure_assets` table with new `failure_risk_score` via Celery task

---

## 🎯 7. Reinforcement Learning — Continuous Improvement (ai-models/)

- [ ] Implement `RoutingRLAgent` with Q-Network:
  - `get_action()` — epsilon-greedy policy with exploration
  - `update()` — Q-learning update step
- [ ] Define reward function:
  - +50 if resolved within SLA
  - +30 if citizen satisfaction ≥ 4
  - -40 if escalated
  - -60 if contested
- [ ] Set up offline training loop with historical grievance data
- [ ] Periodically retrain and push updated weights to production

---

## 🔌 8. Vector Store — Qdrant Integration

- [x] Set up `VectorStore` class:
  - Create `grievances` Qdrant collection (768-dim BERT, cosine distance)
  - `index_grievance()` — generate BERT embedding and upsert to Qdrant with payload
  - [x] `find_similar()` — query top-5 similar resolved grievances by category
- [ ] Integrate `sentence-transformers` / HuggingFace BERT for embedding generation
- [ ] Write `vector_references` record to PostgreSQL after each Qdrant upsert
- [x] Add FastAPI endpoint or use Qdrant client directly from Celery worker

---

## 📈 9. Performance Targets & Benchmarking
- [ ] LLM (Llama-3.1): <100ms, >90% category accuracy
- [ ] CV (ResNet50): <200ms, >85% severity accuracy
- [ ] Whisper STT: <500ms, >95% transcription accuracy
- [ ] GNN Routing: <30ms, >80% optimal route
- [ ] DBSCAN: <1s real-time clustering
- [ ] Vector Search: <50ms top-5 results
- [ ] Create benchmark script (`scripts/benchmark_ml.py`) to validate all targets
