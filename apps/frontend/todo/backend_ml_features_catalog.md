# 🚀 GrievanceGrid: Backend & ML Feature Catalog

This document provides a detailed breakdown of the advanced capabilities powered by the GrievanceGrid backend and Machine Learning infrastructure.

---

## 🧠 Machine Learning & AI Features

The ML layer is designed to move beyond simple data entry, providing autonomous intelligence for triage, prediction, and resolution.

### 1. Intelligent Intake & NLP
- **Autonomous Classification**: Uses Large Language Models (LLMs) to categorize grievances into 12+ specific sectors (e.g., *ROADS, WATER_SUPPLY, ELECTRICITY*) with high precision.
- **Dynamic Prioritization**: Analyzes text semantics to assign one of 5 priority levels—from *MINOR* (aesthetic) to *CRITICAL* (immediate public safety hazard).
- **Automated Summarization**: Generates concise, action-oriented summaries from long-form citizen descriptions for faster officer review.
- **Multilingual Voice Processing**: Integrates OpenAI Whisper for Speech-to-Text (STT) conversion, allowing citizens to report issues in their native languages via audio.

### 2. Computer Vision (CV)
- **Damage Severity Estimation**: Analyzes uploaded "Before" photos using deep learning to quantify the scale of damage (e.g., pothole depth or structure instability), providing an objective severity score between 0 and 1.

### 3. Predictive Analytics & Clustering
- **Predictive Maintenance Engine**: A Scikit-Learn based system that analyzes historical complaint patterns to predict potential infrastructure failure. It identifies specific "factors" (causes) like high recent complaint volume or elevated average severity before a total collapse occurs.
- **Geospatial Crisis Detection (DBSCAN)**: Automatically clusters geographically related grievances to identify systemic "hotspots" (e.g., a burst main pipe causing multiple leaks across a neighborhood).
- **Anomaly Detection (Isolation Forest)**: Identifies "statistical outliers"—isolated, high-severity incidents that don't fit normal patterns but require urgent, specialized attention.
- **Topic Modeling (LDA)**: Uses Latent Dirichlet Allocation to discover hidden themes and recurring "causes" across thousands of unstructured reports, helping city planners understand root issues.

### 4. Advanced Routing & Resolution
- **GNN-Based Routing**: Employs Graph Neural Networks to predict the optimal department for resolution by analyzing the complex "graph" of municipal responsibilities and historical resolution efficiency.
- **Resolution Synthesis (RAG)**: Uses **Qdrant (Vector Database)** for Retrieval-Augmented Generation. Upon submission, the system finds the top 3-5 most similar past resolved cases and presents their solutions to the current officer as a template.

---

## ⚙️ Backend & Infrastructure Features

The backend (`apps/api` and `apps/worker`) provides the high-performance orchestration layer that ties the ML models to the user interface.

### 1. Grievance Orchestration
- **Asynchronous Task Queue**: Powered by **Celery and Redis**, ensuring that heavy AI processing (like CV and LLM analysis) never slows down the user experience.
- **Unified Grievance Lifecycle**: Manages the state machine of a grievance from *CREATED* to *INVESTIGATING*, *RESOLVED*, and *COULD_NOT_RESOLVE*.
- **Cryptographic Resolution**: Implements logic for secure, field-verified resolution updates, ensuring that data integrity is maintained at every step.

### 2. Real-Time Operations
- **Live Citizen Tracking**: Provides a WebSocket-based streaming service that allows citizens to see real-time status updates and (if permitted) the live location of assigned field teams.
- **SLA Management Engine**: Automatically monitors Service Level Agreements, triggering escalations to senior admins if response or resolution deadlines are missed.

### 3. Verification & Security
- **Two-Factor Field Verification**: A specialized GPS-validation service (using the Haversine formula) that prevents officers from marking a case as "Resolved" unless they are physically present at the site (within a 150m radius).
- **Evidence Continuity**: Ensures a mandatory "Before" and "After" photo link for every resolution, creating a verifiable audit trail of work performed.

---

## 📊 Analytics & Reporting
- **City-Wide Heatmaps**: Aggregates geospatial data into interactive visualizations for city administrators to identify high-risk zones.
- **Performance Benchmarking**: Tracks departmental resolution speeds, satisfaction ratings, and SLA compliance trends to drive data-driven governance.
