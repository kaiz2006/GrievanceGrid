FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CELERY_MODE=worker

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src

CMD ["sh", "-c", "if [ \"$CELERY_MODE\" = \"beat\" ]; then celery -A src.celery_app:celery_app beat --loglevel=${WORKER_LOG_LEVEL:-INFO}; else celery -A src.celery_app:celery_app worker --loglevel=${WORKER_LOG_LEVEL:-INFO}; fi"]
