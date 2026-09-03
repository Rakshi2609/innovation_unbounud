import os
import glob
import logging
from typing import List, Optional, Dict, Any
from app.rag.loaders import Document, DocumentLoader
from app.rag.chunker import FinancialChunker
from app.core.config import settings

logger = logging.getLogger(__name__)

class FinancialPolicyStore:
    def __init__(self, collection_name: str = "financial_policies"):
        self.collection_name = collection_name
        self.chunker = FinancialChunker()
        self.documents: List[Document] = []
        self._indexed_files: set = set()
        self._vector_store = None
        self._client = None
        self._init_qdrant()

    def _init_qdrant(self):
        try:
            from qdrant_client import QdrantClient, models
            from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
            from langchain_qdrant import QdrantVectorStore

            self._client = QdrantClient(location=":memory:")
            self._client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE)
            )
            embeddings = FastEmbedEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", threads=1)
            self._vector_store = QdrantVectorStore(
                client=self._client,
                collection_name=self.collection_name,
                embedding=embeddings
            )
            logger.info("Qdrant hybrid vector store initialized in memory.")
        except Exception as e:
            logger.warning(f"Qdrant/FastEmbed fallback mode activated: {e}")
            self._vector_store = None

    def index_directory(self, dir_path: str) -> int:
        if not os.path.exists(dir_path):
            return 0
        total_chunks = 0
        for ext in ["*.md", "*.txt", "*.pdf", "*.csv"]:
            for file_path in glob.glob(os.path.join(dir_path, ext)):
                fname = os.path.basename(file_path)
                if fname not in self._indexed_files:
                    chunks_added = self.index_file(file_path)
                    total_chunks += chunks_added
        return total_chunks

    def index_file(self, file_path: str) -> int:
        fname = os.path.basename(file_path)
        try:
            raw_docs = DocumentLoader.load(file_path)
            chunks = self.chunker.chunk(raw_docs)
            if not chunks:
                return 0

            self.documents.extend(chunks)
            if self._vector_store is not None:
                self._vector_store.add_documents(chunks)

            self._indexed_files.add(fname)
            logger.info(f"Successfully indexed '{fname}' ({len(chunks)} chunks).")
            return len(chunks)
        except Exception as e:
            logger.error(f"Failed indexing {fname}: {e}")
            return 0

    async def search(self, query: str, k: int = 5) -> List[Document]:
        if self._vector_store is not None:
            try:
                retriever = self._vector_store.as_retriever(search_kwargs={"k": k})
                return await retriever.ainvoke(query)
            except Exception as e:
                logger.error(f"Vector search failed, using fallback: {e}")

        # In-memory lexical & section scoring fallback
        query_words = set(query.lower().split())
        scored = []
        for doc in self.documents:
            content = doc.page_content.lower()
            section = doc.metadata.get("section", "").lower()
            clause = doc.metadata.get("clause", "").lower()

            # Word match overlap + section boost
            score = sum(2 for w in query_words if w in content)
            if any(w in section or w in clause for w in query_words):
                score += 3
            if score > 0:
                scored.append((score, doc))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [doc for _, doc in scored[:k]] or self.documents[:k]

    def get_indexed_files(self) -> List[str]:
        return sorted(list(self._indexed_files))
