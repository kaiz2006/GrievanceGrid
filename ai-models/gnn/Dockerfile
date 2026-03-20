FROM python:3.11-slim

WORKDIR /app

# PyTorch Geometric requires some system dependencies typically
RUN apt-get update && apt-get install -y gcc g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
# Since torch-geometric has complex C++ dependencies that can be hard to build from source, 
# relying on the pip install via wheel is usually sufficient in 3.11.
RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app/src

COPY gnn/src /app/src

CMD ["uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8000"]
