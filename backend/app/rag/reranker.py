import math
import logging
from typing import List, Tuple, Dict, Any
from app.rag.loaders import Document

logger = logging.getLogger(__name__)

class CrossEncoderReranker:
    """
    Reranks candidate document chunks against the specific financial query.
    Uses FastEmbed TextCrossEncoder if available, otherwise falls back to exact term-matching scoring.
    """
    MODEL_NAME = "Xenova/ms-marco-MiniLM-L-6-v2"

    def __init__(self, model_name: str = None):
        self.model = None
        try:
            from fastembed.rerank.cross_encoder import TextCrossEncoder
            logger.info(f"Loading cross-encoder reranker: {self.MODEL_NAME}...")
            self.model = TextCrossEncoder(model_name or self.MODEL_NAME, threads=1)
            logger.info("Cross-encoder reranker loaded.")
        except Exception as e:
            logger.warning(f"Cross-encoder not initialized ({e}), using lexical reranking fallback.")

    def rerank(
        self,
        query: str,
        docs: List[Document],
        top_k: int = 3
    ) -> Tuple[List[Document], List[float]]:
        if not docs:
            return [], []

        if self.model is not None:
            try:
                passages = [doc.page_content for doc in docs]
                raw_scores = list(self.model.rerank(query, passages))
                scored = sorted(zip(raw_scores, docs), key=lambda x: x[0], reverse=True)
                top_docs = [doc for _, doc in scored[:top_k]]
                top_scores = [float(score) for score, _ in scored[:top_k]]
                return top_docs, top_scores
            except Exception as e:
                logger.error(f"Error in neural reranking: {e}")

        # Lexical term frequency fallback
        query_terms = set(query.lower().split())
        scored_fallback = []
        for doc in docs:
            text = doc.page_content.lower()
            overlap = sum(1 for term in query_terms if term in text)
            score = overlap / max(len(query_terms), 1)
            scored_fallback.append((score, doc))

        scored_fallback.sort(key=lambda x: x[0], reverse=True)
        return [doc for _, doc in scored_fallback[:top_k]], [score for score, _ in scored_fallback[:top_k]]

    @staticmethod
    def score_to_confidence(scores: List[float]) -> Dict[str, Any]:
        if not scores:
            return {"score": 0.0, "label": "Low", "confidence": 0.0}
        avg_score = sum(scores) / max(len(scores), 1)
        normalized = min(max(avg_score, 0.0), 1.0)
        label = "High" if normalized >= 0.7 else "Medium" if normalized >= 0.4 else "Low"
        return {"score": round(normalized, 2), "label": label, "confidence": round(normalized * 100, 1)}
