# 🧠 Real ML Activation Guide

This guide explains how to move from "Smart Fallbacks" to **Real ML Inference** for the GrievanceGrid project.

## 1. Prerequisites
- **Hardware**: NVIDIA GPU (8GB+ VRAM recommended) with `nvidia-container-toolkit` installed.
- **Environment**: 
  - `apps/worker/.env`: Set `WORKER_DRY_RUN=False`
  - `ai-models/.env`: Set `STRICT_MODEL_STARTUP=True`

---

## 2. LLM (Large Language Model)
The system uses **Llama-3.1** via vLLM.
1. **Download Weights**: Download `Meta-Llama-3.1-8B-Instruct` (GGUF or AWQ format for local efficiency).
2. **Place**: Save files to `ai-models/llm/models/llama-3.1-8b/`.
3. **Config**: Update `ai-models/llm/src/config.py` with the local model path.
4. **Alternative**: Set `OPENAI_API_KEY` in `ai-models/llm/.env` to use GPT-4 as the backbone.

---

## 3. CV (Computer Vision)
You need to train the ResNet50 model on your specific damage dataset.
1. **Prepare Data**: Place your labeled images in `ai-models/cv/data/images/`.
   - Structure: `0_MINOR/`, `1_LOW/`, `2_MODERATE/`, `3_SEVERE/`, `4_CRITICAL/`
2. **Train**:
   ```bash
   docker compose run ml-cv python src/training/trainer.py
   ```
3. **Verify**: Check for `ai-models/cv/models/damage_classifier.pth`.

---

## 4. GNN (Graph Neural Network)
1. **Prepare Data**: Use the existing `ai-models/data/simulated_damage_50k.json`.
2. **Train**:
   ```bash
   docker compose run ml-gnn python src/trainer.py
   ```
3. **Verify**: Check for `ai-models/gnn/models/department_gnn.pth`.

---

## 5. Whisper (Voice-to-Text)
The system automatically downloads the `base` Whisper model on first run. Ensure the `ml-llm` container has internet access during its initial boot.

---

## 🚀 Activation Script
Run `./scripts/train-all.sh` (if data is present) to automate the training of GNN and CV models.
