from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1 import grievances, voice, tracking, clusters, admin, analytics, auth

app = FastAPI(
    title="GrievanceGrid API",
    description="AI-Powered Public Grievance Redressal System",
    version="1.0.0"
)

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

app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(grievances.router, prefix="/api/v1/grievances", tags=["Grievances"])
app.include_router(voice.router, prefix="/api/v1/voice", tags=["Voice"])
app.include_router(tracking.router, prefix="/api/v1/track", tags=["Tracking"])
app.include_router(clusters.router, prefix="/api/v1/clusters", tags=["Clusters"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
