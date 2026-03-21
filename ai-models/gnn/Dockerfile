FROM python:3.11-slim

WORKDIR /app

# PyTorch Geometric requires some system dependencies typically
RUN apt-get update && apt-get install -y gcc g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app/src

COPY gnn/src /app/src

CMD ["uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8003"]
