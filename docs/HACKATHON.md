# GrievanceGrid — Hackathon Demo Guide

Welcome to the GrievanceGrid demo! This project showcases a next-gen AI-powered public grievance system.

## 🚀 Key "Wow" Features

### 1. Multimodal AI Processing 🧠
Submit a grievance with a photo or voice note.
- **Computer Vision**: ResNet50 analyzes images for damage severity.
- **LLM Intelligence**: Llama-3.1 extracts category, priority, and suggests resolutions.
- **Voice Transcription**: Whisper handles regional language grievance reporting.

### 2. Graph Neural Network Routing 🕸️
Instead of static rules, a GNN analyzes department dependencies to find the optimal routing path for complex grievances (e.g., a "burst pipe near electric lines" routed to both Water and Power).

### 3. Real-Time Package-Style Tracking 📡
Citizens see a live timeline of their grievance, including internal AI processing steps and team ETAs.

### 4. Predictive Infrastructure Maintenance 🔮
The system analyzes historical patterns to predict which assets (transformers, sewage lines) are at risk of failure *before* a grievance is filed.

## 🏃 How to Demo

1. **Submit**: Open the frontend and submit a "pothole" grievance with an image.
2. **Worker View**: Show the `grievance-worker` logs or Flower dashboard to see the AI analysis in real-time.
3. **Track**: Use the Grid ID to show the package-style timeline and AI-generated severity.
4. **Admin View**: Show the geospatial clusters where multiple grievances are building up.

## 🛠️ Technical Stack
- **Backend**: FastAPI, Celery, Redis, PostgreSQL (PostGIS).
- **Frontend**: React + Vite, Tailwind CSS.
- **AI/ML**: Python (Torch, Transformers, VLLM), Qdrant (Vector DB).
- **Orchestration**: Docker Compose, Turborepo.
