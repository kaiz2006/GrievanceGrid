from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from src.api.v1 import grievances, voice, tracking, clusters, admin, analytics, auth
from src.core.config import settings
from src.core.database import close_db
from src.core.logging import configure_logging
from src.core.rate_limit import RedisRateLimitMiddleware
from src.core.redis_client import close_redis_client

configure_logging()

app = FastAPI(
    title=settings.app_name,
    description="AI-Powered Public Grievance Redressal System",
    version=settings.app_version,
)

if settings.object_storage_provider.lower() == "local":
    storage_path = Path(settings.object_storage_local_dir)
    storage_path.mkdir(parents=True, exist_ok=True)
    app.mount(
        settings.object_storage_public_base_url,
        StaticFiles(directory=str(storage_path)),
        name="object-storage",
    )

app.add_middleware(RedisRateLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await close_redis_client()
    await close_db()

app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(grievances.router, prefix="/api/v1/grievances", tags=["Grievances"])
app.include_router(voice.router, prefix="/api/v1/voice", tags=["Voice"])
app.include_router(tracking.router, prefix="/api/v1/track", tags=["Tracking"])
app.include_router(clusters.router, prefix="/api/v1/clusters", tags=["Clusters"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.add_api_websocket_route("/ws/track/{grid_id}", tracking.tracking_ws_handler)
