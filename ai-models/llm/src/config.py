from __future__ import annotations

import os

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class LLMConfig(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore")

    app_env: str = Field(default="development", alias="APP_ENV")

    # Model Configuration
    model_name: str = Field(default="meta-llama/Meta-Llama-3-8B-Instruct", alias="LLAMA_MODEL_ID")
    embedding_model: str = Field(default="intfloat/e5-small-v2", alias="EMBEDDING_MODEL_ID")
    max_tokens: int = Field(default=512, alias="LLM_MAX_TOKENS")
    temperature: float = Field(default=0.1, alias="LLM_TEMPERATURE")
    context_window: int = Field(default=8192, alias="LLM_CONTEXT_WINDOW")

    # Inference endpoints
    use_vllm: bool = Field(default=True, alias="USE_VLLM")
    vllm_base_url: str = Field(default="http://localhost:8000/v1", alias="VLLM_BASE_URL")
    vllm_api_key: str | None = Field(default=None, alias="VLLM_API_KEY")
    timeout_seconds: float = Field(default=8.0, alias="ML_TIMEOUT_SECONDS")

    # Artifact checks
    strict_startup: bool = Field(default=False, alias="STRICT_MODEL_STARTUP")
    llm_model_artifact_path: str = Field(default="/app/models/llm", alias="LLM_MODEL_ARTIFACT_PATH")

    # Prompt Paths
    prompts_dir: str = os.path.join(os.path.dirname(__file__), "..", "prompts")
    classification_prompt_path: str = os.path.join(prompts_dir, "classification.md")
    routing_prompt_path: str = os.path.join(prompts_dir, "routing.md")
    resolution_prompt_path: str = os.path.join(prompts_dir, "resolution.md")

    @property
    def is_strict_mode(self) -> bool:
        if self.strict_startup:
            return True
        return self.app_env.lower() in {"production", "staging"}


llm_config = LLMConfig()
