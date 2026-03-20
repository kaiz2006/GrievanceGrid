import os
from pydantic_settings import BaseSettings

class LLMConfig(BaseSettings):
    # Model Configuration
    model_name: str = os.getenv("LLAMA_MODEL_ID", "meta-llama/Meta-Llama-3-8B-Instruct")
    max_tokens: int = int(os.getenv("LLM_MAX_TOKENS", "512"))
    temperature: float = float(os.getenv("LLM_TEMPERATURE", "0.1"))
    context_window: int = int(os.getenv("LLM_CONTEXT_WINDOW", "8192"))
    
    # Prompt Paths
    prompts_dir: str = os.path.join(os.path.dirname(__file__), "..", "prompts")
    classification_prompt_path: str = os.path.join(prompts_dir, "classification.md")
    routing_prompt_path: str = os.path.join(prompts_dir, "routing.md")
    resolution_prompt_path: str = os.path.join(prompts_dir, "resolution.md")

llm_config = LLMConfig()
