FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for audio processing (Whisper needs ffmpeg)
RUN apt-get update && apt-get install -y ffmpeg gcc python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app/src

COPY llm/src /app/src

CMD ["uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8000"]
