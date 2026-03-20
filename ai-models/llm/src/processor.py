import os
import json
import logging
from typing import Dict, Any, List

from config import llm_config

logger = logging.getLogger(__name__)

# Try to import local ML libraries
try:
    from sentence_transformers import SentenceTransformer
    HAS_LOCAL_ML = True
except ImportError:
    HAS_LOCAL_ML = False
    logger.warning("Local ML libraries (sentence_transformers) not found.")

try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

try:
    from qdrant_client import QdrantClient
    HAS_QDRANT = True
except ImportError:
    HAS_QDRANT = False

class GrievanceLLMProcessor:
    def __init__(self):
        self.use_gpu = os.getenv("USE_GPU", "true").lower() == "true"
        self.device = "cuda" if self.use_gpu else "cpu"
        
        # Local Embedding Model
        self.embedder = None
        if HAS_LOCAL_ML:
            try:
                self.embedder = SentenceTransformer(os.getenv("SENTENCE_TRANSFORMER_ID", "all-MiniLM-L6-v2"), device=self.device)
            except Exception as e:
                logger.error(f"Failed to load local embedding model: {e}")
                
        # LLM inference strategy
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = OpenAI(api_key=self.openai_key) if self.openai_key and HAS_OPENAI else None

        # Qdrant client for RAG resolution
        self.qdrant_url = os.getenv("QDRANT_URL", "http://qdrant:6333")
        self.qdrant_client = QdrantClient(url=self.qdrant_url) if HAS_QDRANT else None

    def _read_prompt(self, path: str, **kwargs) -> str:
        with open(path, "r", encoding="utf-8") as f:
            template = f.read()
        return template.format(**kwargs)

    def process_unstructured_text(self, text: str) -> Dict[str, Any]:
        """Extract category, priority, summary, and department from unstructured text."""
        if self.openai_client:
            prompt = self._read_prompt(llm_config.classification_prompt_path, text=text)
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                    max_tokens=llm_config.max_tokens,
                    temperature=llm_config.temperature
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                logger.error(f"OpenAI fallback failed: {e}")

        # Final naive fallback if no ML or API is available
        return {
            "category": "ROADS" if "road" in text.lower() or "pothole" in text.lower() else "OTHER",
            "priority": "MODERATE",
            "summary": "Extracted from text: " + text[:50],
            "department": "PWD" if "road" in text.lower() else "GENERAL"
        }

    def generate_embedding(self, text: str) -> List[float]:
        """Generate vector embeddings for the grievance text."""
        if self.embedder:
            try:
                return self.embedder.encode(text).tolist()
            except Exception as e:
                logger.error(f"Local embedding failed: {e}")

        if self.openai_client:
            try:
                response = self.openai_client.embeddings.create(
                    model="text-embedding-3-small",
                    input=text
                )
                return response.data[0].embedding
            except Exception as e:
                logger.error(f"OpenAI embedding fallback failed: {e}")
                
        return [0.0] * 768

    def suggest_resolution(self, grievance: Dict[str, Any]) -> str:
        """Query Qdrant for similar resolved cases and synthesize a resolution."""
        text = grievance.get("text", grievance.get("summary", ""))
        category = grievance.get("category", "")
        
        historical_docs = []
        if self.qdrant_client and text:
            vector = self.generate_embedding(text)
            try:
                results = self.qdrant_client.search(
                    collection_name="grievances",
                    query_vector=vector,
                    limit=3,
                    # We would ideally use filter=models.Filter(...) to only get RESOLVED cases for the same category
                )
                for res in results:
                    p = res.payload or {}
                    historical_docs.append(f"- Resolved by {p.get('department')}: {p.get('resolution_notes')}")
            except Exception as e:
                logger.error(f"Qdrant search failed: {e}")

        history_str = "\n".join(historical_docs) if historical_docs else "No highly similar resolved cases found."
        
        if self.openai_client:
            prompt = self._read_prompt(llm_config.resolution_prompt_path, text=text, category=category, historical_solutions=history_str)
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=200
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.error(f"Synthesis failed: {e}")
                
        return "1. Dispatch assessment crew\n2. Secure area if hazardous\n3. Execute standard repairs for category."

processor = GrievanceLLMProcessor()
