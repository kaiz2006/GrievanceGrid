from __future__ import annotations

from functools import cached_property

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class ApiSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "apps/api/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = Field(default="development", alias="APP_ENV")
    app_name: str = Field(default="GrievanceGrid API", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")

    database_url: str = Field(
        default="postgresql+asyncpg://grievances:grievances@localhost:5432/grievances",
        alias="DATABASE_URL",
    )
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    redis_pubsub_url: str | None = Field(default=None, alias="REDIS_PUBSUB_URL")
    qdrant_url: str = Field(default="http://localhost:6333", alias="QDRANT_URL")
    jwt_secret: str = Field(alias="JWT_SECRET")
    llm_api_url: str = Field(default="http://localhost:8001", alias="LLM_API_URL")
    cv_api_url: str = Field(default="http://localhost:8002", alias="CV_API_URL")
    gnn_api_url: str = Field(default="http://localhost:8003", alias="GNN_API_URL")

    cors_allow_origins: str = Field(
        default="http://localhost:3000,http://localhost:5173",
        alias="CORS_ALLOW_ORIGINS",
    )

    celery_broker_url: str = Field(default="redis://localhost:6379/0", alias="CELERY_BROKER_URL")
    celery_result_backend: str = Field(default="redis://localhost:6379/1", alias="CELERY_RESULT_BACKEND")
    internal_worker_token: str = Field(alias="INTERNAL_WORKER_TOKEN")

    access_token_expire_minutes: int = Field(default=30, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    rate_limit_requests_per_window: int = Field(default=120, alias="RATE_LIMIT_REQUESTS")
    rate_limit_window_seconds: int = Field(default=60, alias="RATE_LIMIT_WINDOW_SECONDS")

    session_prefix: str = Field(default="session", alias="SESSION_PREFIX")
    rate_limit_prefix: str = Field(default="rate-limit", alias="RATE_LIMIT_PREFIX")
    team_location_prefix: str = Field(default="team", alias="TEAM_LOCATION_PREFIX")

    object_storage_provider: str = Field(default="local", alias="OBJECT_STORAGE_PROVIDER")
    object_storage_local_dir: str = Field(default="apps/api/storage", alias="OBJECT_STORAGE_LOCAL_DIR")
    object_storage_public_base_url: str = Field(default="/storage", alias="OBJECT_STORAGE_PUBLIC_BASE_URL")

    @cached_property
    def parsed_cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_allow_origins.split(",")
            if origin.strip()
        ]


settings = ApiSettings()