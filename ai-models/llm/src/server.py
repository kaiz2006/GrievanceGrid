import os
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel

from processor import processor
from voice_processor import voice_processor

app = FastAPI(title="GrievanceGrid LLM & Voice Service")

class TextRequest(BaseModel):
    text: str = None
    input: str = None

class AudioRequest(BaseModel):
    audio_url: str = None
    audio_path: str = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/process-text")
@app.post("/classify")
def process_text(req: TextRequest):
    text = req.text or req.input
    if not text:
        raise HTTPException(status_code=400, detail="Missing text or input field")
    
    result = processor.process_unstructured_text(text)
    return {"data": result}

@app.post("/embed")
@app.post("/embeddings")
def generate_embedding(req: TextRequest):
    text = req.text or req.input
    if not text:
        raise HTTPException(status_code=400, detail="Missing text or input field")
    
    vector = processor.generate_embedding(text)
    return {"embedding": vector}

@app.post("/transcribe")
@app.post("/voice/transcribe")
async def transcribe_audio(
    req: AudioRequest = None, 
    file: UploadFile = File(None)
):
    path_to_transcribe = None
    temp_file_path = None
    
    try:
        if file:
            suffix = os.path.splitext(file.filename)[1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
                content = await file.read()
                temp.write(content)
                temp_file_path = temp.name
            path_to_transcribe = temp_file_path
        elif req and (req.audio_url or req.audio_path):
            path_to_transcribe = req.audio_url or req.audio_path
        else:
            raise HTTPException(status_code=400, detail="Missing audio file, audio_url, or audio_path")
        
        result = voice_processor.transcribe(path_to_transcribe)
        return result
    finally:
        # Cleanup temp file if we created one
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
