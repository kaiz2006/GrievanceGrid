import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from inference import estimator

app = FastAPI(title="GrievanceGrid CV Service")

class ImageRequest(BaseModel):
    image_url: str = None
    image_path: str = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/severity")
@app.post("/estimate-severity")
def estimate_severity(req: ImageRequest):
    path = req.image_url or req.image_path
    if not path:
        raise HTTPException(status_code=400, detail="Missing image_url or image_path field")
    
    score = estimator.estimate_severity(path)
    return {"severity": score}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
