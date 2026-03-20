import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

try:
    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.decomposition import LatentDirichletAllocation
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False
    logger.warning("scikit-learn not available. Falling back to stub topic extraction.")

class TopicAnalysisService:
    def __init__(self, n_topics=1, n_top_words=5):
        self.n_topics = n_topics
        self.n_top_words = n_top_words

    def extract_topics(self, texts: List[str]) -> List[str]:
        """Extract top human-readable keywords characterizing a group of texts."""
        if not texts:
            return []
            
        if not HAS_SKLEARN or len(texts) < 3:
            # Fallback for small batches or missing dependencies
            words = " ".join(texts).split()
            # Extremely naive word counting ignoring stopwords
            counts = {}
            for w in words:
                w = w.lower()
                if len(w) > 4:
                    counts[w] = counts.get(w, 0) + 1
            sorted_words = sorted(counts.items(), key=lambda x: x[1], reverse=True)
            return [w for w, count in sorted_words[:self.n_top_words]]

        try:
            vectorizer = CountVectorizer(stop_words='english', max_features=1000)
            X = vectorizer.fit_transform(texts)
            
            # Ensure n_topics is <= document count for stability
            n_comp = min(self.n_topics, len(texts))
            
            lda = LatentDirichletAllocation(n_components=n_comp, random_state=42)
            lda.fit(X)
            
            feature_names = vectorizer.get_feature_names_out()
            
            top_words = []
            for topic_idx, topic in enumerate(lda.components_):
                top_features_ind = topic.argsort()[: -self.n_top_words - 1: -1]
                topic_words = [feature_names[i] for i in top_features_ind]
                top_words.extend(topic_words)
                
            # Deduplicate while preserving order
            seen = set()
            result = []
            for w in top_words:
                if w not in seen:
                    result.append(w)
                    seen.add(w)
            
            return result[:self.n_top_words]
            
        except Exception as e:
            logger.error(f"LDA topic extraction failed: {e}")
            return []

topic_analyzer = TopicAnalysisService()
