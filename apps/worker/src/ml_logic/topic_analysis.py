import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

try:
    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.decomposition import LatentDirichletAllocation
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

class TopicAnalysisService:
    def __init__(self, n_topics=3):
        self.n_topics = n_topics
        if HAS_SKLEARN:
            self.vectorizer = CountVectorizer(stop_words='english', max_features=1000)
            self.lda = LatentDirichletAllocation(n_components=n_topics, random_state=42)

    def extract_topics(self, texts: List[str]) -> List[Dict[str, Any]]:
        if not texts or len(texts) < 5 or not HAS_SKLEARN:
            return [{"topic_id": 0, "keywords": ["general"]}]
        
        try:
            X = self.vectorizer.fit_transform(texts)
            self.lda.fit(X)
            
            feature_names = self.vectorizer.get_feature_names_out()
            topics = []
            for idx, topic in enumerate(self.lda.components_):
                top_keywords = [feature_names[i] for i in topic.argsort()[:-6:-1]]
                topics.append({"topic_id": idx, "keywords": top_keywords})
            return topics
        except Exception as e:
            logger.warning(f"LDA failed: {e}")
            return [{"topic_id": 0, "keywords": ["analysis_failed"]}]

topic_analysis = TopicAnalysisService()
