import re
from typing import List, Dict, Any

try:
    from langchain_core.documents import Document
except ImportError:
    from app.rag.loaders import Document

class FinancialChunker:
    def __init__(self, chunk_size: int = 450, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk(self, docs: List[Document]) -> List[Document]:
        chunks: List[Document] = []
        for doc in docs:
            raw_text = doc.page_content
            # Split primarily on markdown section/clause boundaries
            paragraphs = re.split(r'(\n## |\n### |\n\* )', raw_text)
            current_chunk = ""

            for part in paragraphs:
                if len(current_chunk) + len(part) <= self.chunk_size:
                    current_chunk += part
                else:
                    if current_chunk.strip():
                        chunks.append(self._create_chunk_doc(current_chunk.strip(), doc, len(chunks)))
                    current_chunk = part

            if current_chunk.strip():
                chunks.append(self._create_chunk_doc(current_chunk.strip(), doc, len(chunks)))
        return chunks

    def _create_chunk_doc(self, text: str, parent_doc: Document, index: int) -> Document:
        section_match = re.search(r'Section\s+\d+[^:\n]*', text, re.IGNORECASE)
        clause_match = re.search(r'Clause\s+\d+\.\d+[^:\n*]*', text, re.IGNORECASE)

        section_name = section_match.group(0).strip() if section_match else parent_doc.metadata.get("section", "General Provisions")
        clause_name = clause_match.group(0).strip() if clause_match else f"Clause {index + 1}"

        metadata = {
            "source_file": parent_doc.metadata.get("source_file", "unknown"),
            "page_number": parent_doc.metadata.get("page_number", 1),
            "section": section_name,
            "clause": clause_name,
            "chunk_index": index
        }
        return Document(page_content=text, metadata=metadata)
