# ML Training Guide: GrievanceGrid

This document outlines the training procedures for the machine learning models used in GrievanceGrid.

## 🏗️ Models Architecture

GrievanceGrid uses a distributed ML architecture for multi-modal analysis:

1.  **CV Severity Classifier (ResNet50)**: Analyzes grievance photos to estimate damage severity.
2.  **GNN Routing Model (GAT)**: Predicts the best department for a grievance based on its relationship to historical cases.
3.  **RL Routing Agent**: A Reinforcement Learning agent that optimizes routing decisions over time.
4.  **Anomaly Detector**: A local model for identifying suspicious or outlier grievances.

---

## 📸 1. Training the CV Model

The CV model is a ResNet50-based image classifier.

-   **Training Script**: `ai-models/cv/src/training/trainer.py`
-   **Data Location**: `ai-models/cv/data/train/`
-   **How to Train**:
    ```bash
    docker compose run --rm ml-cv python src/training/trainer.py
    ```
-   **Output**: The trained model will be saved to `ai-models/cv/models/severity_model.pth`.

---

## 🕸️ 2. Training the GNN Model

The GNN model uses Graph Attention Networks (GAT) for automated grievance routing based on a graph of city departments.

### **GNN Data Sourcing**
For the best results, use historical 311 service request data which contains "Complaint Type" and "Agency" (Target).

*   **[NYC 311 Service Requests (Kaggle)](https://www.kaggle.com/datasets/new-york-city/nyc-311-service-requests)**: Standard source for urban requests.
*   **[Chicago 311 Service Requests (Data.gov)](https://catalog.data.gov/dataset/311-service-requests)**: High-quality urban service data.

### **Preprocessing for GNN**
Use the included `preprocess_311.py` script to map 311 agencies (like NYPD, DEP) to GrievanceGrid departments (POLICE, WATER) and vectorize the text.

```bash
# Example preprocessing command
python ai-models/gnn/src/preprocess_311.py --input nyc_311.csv --output ai-models/gnn/data/preprocessed.pt
```

### **How to Train the GNN**
```bash
docker compose run --rm ml-gnn python src/trainer.py --data data/preprocessed.pt
```

---

## 🎯 3. Training the RL Agent

The RL Agent uses Off-policy Reinforcement Learning to optimize grievance routing based on historical resolution times and citizen satisfaction.

### **RL Data Sourcing**
This model requires a special `historical_grievances.csv` that includes resolution times and satisfaction scores.

### **Building the RL Dataset**
You can build this dataset using the **NYC 311** data you already downloaded! Use the included `build_rl_dataset.py` to derive the necessary metrics.

```bash
python ai-models/rl_agent/src/build_rl_dataset.py --input ai-models/gnn/data/nyc_311.csv --output ai-models/rl_agent/data/historical_grievances.csv
```

### **How to Train the RL Agent**
```bash
docker compose run --rm ml-rl-agent python src/train_offline.py
```

---

## 🛠️ Orchestration: `train-all.sh`

For a complete system refresh, use the central orchestration script:

```bash
./scripts/train-all.sh
```

This script will sequentially train the CV, GNN, and RL models.

---

## 🚀 Activating Live Inference

By default, the worker may run in **DRY_RUN** mode to avoid errors while models are missing.

1.  **Ensure Models Exist**: Check that `.pth` or `.joblib` files are present in the `ai-models/*/models/` directories.
2.  **Update Worker Config**: Edit `apps/worker/.env`:
    ```env
    WORKER_DRY_RUN=False
    ```
3.  **Restart Worker**:
    ```bash
    docker compose restart worker
    ```

---

## 📚 Recommended Datasets for CV Training

If you are just getting started and need to train the models from scratch, here are some high-quality datasets that align with common GrievanceGrid use cases:

### 1. Pothole Severity & Road Damage
*   **[Annotated Potholes with Severity Levels (Kaggle)](https://www.kaggle.com/datasets/viren9202/annotated-potholes-with-severity-levels)**: ~700 images categorized into minor, medium, and major severity.
*   **[Pothole Severity Detection (Roboflow)](https://universe.roboflow.com/pothole-severity/pothole-severity-detection-object-detection)**: Includes multi-class labels for high, medium, and low severity.
*   **[RDD2022: Multi-National Road Damage Dataset](https://datasetninja.com/rdd2022)**: Large-scale dataset with over 47k images covering various road crack types and potholes.

### 2. Illegal Dumping & Waste Detection
*   **[TACO: Trash Annotations in Context](https://github.com/pedropro/TACO)**: Images of litter in urban and natural environments with pixel-level segmentation.
*   **[Illegal Dumping Detection (Roboflow Universe)](https://universe.roboflow.com/bill-uncl0/illegal-dumping-detection)**: Focused specifically on identifying dumped items in urban settings.
*   **[Garbage Classification V2 (Kaggle)](https://www.kaggle.com/datasets/mostafaabla/garbage-classification)**: Helpful for training classification models to distinguish between material types.

### 3. General Urban Infrastructure
*   **[Road Issues Detection (Kaggle)](https://www.kaggle.com/datasets/marnon/road-issues-detection-dataset)**: Images of broken road signs, potholes, and damaged street furniture.

---

## 🏗️ Data Selection Strategy

The **Damage Detection Model** in GrievanceGrid expects images to be sorted into **5 severity folders** (`0_MINOR`, `1_LOW`, `2_MODERATE`, `3_SEVERE`, `4_CRITICAL`).

### Which dataset should you pick?

1.  **For a Quick Start (Recommended)**: Choose **one high-quality dataset** (like the *Annotated Potholes with Severity Levels*). Since it already has 3 severity categories, you can map them easily:
    -   `minor` -> `0_MINOR`
    -   `medium` -> `2_MODERATE`
    -   `major` -> `4_CRITICAL`

2.  **For a Robust System**: Choose **one from each category** (Potholes, Illegal Dumping, and Infrastructure). This will make your model "grievance-agnostic"—it will learn to identify *any* kind of damage or urban problem across different contexts.
    -   **Tip**: If you mix datasets, you will need to manually sort a subset of them into our 5 folders to ensure the model learns correctly.

---

## 📊 Monitoring

Training logs can be viewed via Docker:
```bash
docker compose logs -f ml-cv
docker compose logs -f ml-gnn
```
