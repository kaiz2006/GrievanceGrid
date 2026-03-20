# 🧐 What's Missing & Extra: Design vs. Backend Core

This analysis compares the `design` folder content against the **Backend Logic** (`apps/api`, `apps/worker`) and **ML Brain** (`ai-models`).

---

## 🚩 Extra in Design (Not in Backend/ML)
*These are visionary features in the designs that have no supporting code in the backend yet.*

1.  **Blockchain Immutability Layer**: 
    - **In Design**: Explicit mentions of "Institutional Blockchain," "Anchoring Hashes," and "Case Immutability."
    - **In Code**: **Completely Missing.** There is no ledger or blockchain integration code.
2.  **AI Decision Explainability (Trace IDs)**:
    - **In Design**: Visual "Node Paths" showing how the AI moved from `Intake -> Core -> Dept`.
    - **In Code**: **Partially Missing.** The models calculate these, but the API doesn't persist or expose the "Audit Trace" or "Reasoning Path" for the UI.
3.  **Cryptographic Forensic Metadata**:
    - **In Design**: "Digital Signature Verification," "MD5/SHA Hashes for Evidence," and "Chain of Custody" protocols.
    - **In Code**: **Missing.** The backend handles standard file uploads via FastAPI, but lacks any forensic hashing or signing logic.
4.  **Financial Recovery Analysis**:
    - **In Design**: "Verified Delta" and "Recovery in Progress" (e.g., "$2.4M saved via fraud detection").
    - **In Code**: **Missing.** The anomaly detection logic exists, but the "Financial Impact" calculation is not implemented.

---

## 💎 Missing in Design (Extra in Backend/ML)
*These are powerful backend capabilities that aren't yet represented or visualized in the designs.*

1.  **RAG-Driven Similarity Engine**:
    - **In Code**: Integration with **Qdrant Vector DB** and `Sentence Transformers` to find "Similar Historical Cases" meaningfully.
    - **In Design**: **Missing.** The designs focus on single-case status, missing the opportunity to show a "Compare with similar 5 cases" intelligence view.
2.  **LDA Topic Modeling**:
    - **In Code**: A specific `TopicAnalysisService` that extracts granular keywords (e.g., "Pothole", "Water Leak", "Ward 12") from clusters.
    - **In Design**: **Missing.** Designs show simple "Categories" but not the dynamically-extracted "Trending Topics" metadata.
3.  **Asynchronous Resilience (Celery/Redis)**:
    - **In Code**: A robust worker-app architecture that handles retries, delays, and parallel AI inference.
    - **In Design**: **Unseen.** The designs don't visualize the "System Health" or "Queue Status" of the massive AI background work.
4.  **Heuristic Fallback Systems**:
    - **In Code**: Every AI model (GNN, RF) has a `heuristic_fallback` logic to ensure the system works even if ML models are down.
    - **In Design**: **Unseen.** The designs assume the AI is always "Online" and don't show "Fallback Status" modes.

---

## 📈 Summary Comparison
- **Design Folder**: Focused on **Governance, Security, and Forensic Transparency**.
- **Backend/ML Core**: Focused on **AI Reasoning, Search Intelligence, and Engineering Scale**.

**The Gap**: The backend needs a "Security & Forensic" upgrade, while the designs need to be updated to show off the "Search & Similarity" intelligence already built into the backend.
