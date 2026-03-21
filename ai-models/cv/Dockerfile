FROM python:3.11-slim

WORKDIR /app

# Add dependencies for PIL handling URLs, and OpenCV if needed later
RUN apt-get update && apt-get install -y libglib2.0-0 libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app/src

COPY cv/src /app/src

CMD ["uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8002"]
