from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from src.api.v1 import grievances, voice, tracking, clusters, admin, analytics, auth, operations, verification, audits, media, crew
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

cors_origins = settings.parsed_cors_origins
if settings.app_env.lower() == "production" and (not cors_origins or "*" in cors_origins):
    raise RuntimeError("CORS_ALLOW_ORIGINS must be an explicit allowlist in production")

if not cors_origins:
    cors_origins = ["*"]

if settings.object_storage_provider.lower() == "local":
    storage_path = Path(settings.object_storage_local_dir)
    storage_path.mkdir(parents=True, exist_ok=True)
    app.mount(
        settings.object_storage_public_base_url,
        StaticFiles(directory=str(storage_path)),
        name="object-storage",
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RedisRateLimitMiddleware)

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
app.include_router(operations.router, prefix="/api/v1/operations", tags=["Operations"])
app.include_router(verification.router, prefix="/api/v1/verify", tags=["Verification"])
app.include_router(audits.router, prefix="/api/v1/audits", tags=["Audits"])
app.include_router(media.router, prefix="/api/v1/media", tags=["Media"])
app.include_router(crew.router, prefix="/api/v1/crew", tags=["Crew"])

app.add_api_websocket_route("/ws/track/{grid_id}", tracking.tracking_ws_handler)
