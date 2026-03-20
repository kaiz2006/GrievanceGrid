import os
from fastapi import FastAPI, HTTPException
from typing import Dict, Any

from inference import router

app = FastAPI(title="GrievanceGrid GNN Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/route")
@app.post("/predict-route")
def predict_route(grievance: Dict[str, Any]):
    if not grievance:
        raise HTTPException(status_code=400, detail="Missing grievance payload")
    
    top_department, all_departments = router.predict_route(grievance)
    
    return {
        "department": top_department,
        "top_departments": all_departments
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
