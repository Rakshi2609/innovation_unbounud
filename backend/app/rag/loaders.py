import os
import re
import csv
import logging
from typing import List, Dict, Any

try:
    from langchain_core.documents import Document
except ImportError:
    class Document:
        def __init__(self, page_content: str, metadata: Dict[str, Any] = None):
            self.page_content = page_content
            self.metadata = metadata or {}

logger = logging.getLogger(__name__)

class DocumentLoader:
    @staticmethod
    def redact_pii(text: str) -> str:
        """Redacts sensitive financial PII such as SSNs, emails, phone numbers, and full credit card numbers."""
        if not text:
            return ""
        # Email
        text = re.sub(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', '[REDACTED_EMAIL]', text)
        # SSN / Tax ID
        text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[REDACTED_SSN]', text)
        # Phone Numbers
        text = re.sub(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b', '[REDACTED_PHONE]', text)
        # 16-digit Credit Card Numbers
        text = re.sub(r'\b(?:\d{4}[-\s]?){3}\d{4}\b', '[REDACTED_CARD_NUM]', text)
        return text

    @classmethod
    def load(cls, file_path: str) -> List[Document]:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        file_name = os.path.basename(file_path)
        ext = os.path.splitext(file_name)[1].lower()
        documents: List[Document] = []

        try:
            if ext in [".md", ".txt"]:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = cls.redact_pii(f.read())
                    documents.append(Document(page_content=content, metadata={"source_file": file_name, "page_number": 1}))

            elif ext == ".pdf":
                try:
                    import pypdf
                    reader = pypdf.PdfReader(file_path)
                    for i, page in enumerate(reader.pages):
                        text = page.extract_text() or ""
                        if text.strip():
                            documents.append(Document(
                                page_content=cls.redact_pii(text),
                                metadata={"source_file": file_name, "page_number": i + 1}
                            ))
                except Exception:
                    with open(file_path, "rb") as f:
                        documents.append(Document(page_content=f.read().decode("utf-8", "ignore"), metadata={"source_file": file_name, "page_number": 1}))

            elif ext == ".csv":
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    reader = csv.reader(f)
                    rows = list(reader)
                    if rows:
                        headers = rows[0]
                        lines = [f"{headers}: {row}" for row in rows[1:]]
                        text = "\n".join(lines)
                        documents.append(Document(page_content=cls.redact_pii(text), metadata={"source_file": file_name, "page_number": 1}))

            else:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = cls.redact_pii(f.read())
                    documents.append(Document(page_content=content, metadata={"source_file": file_name, "page_number": 1}))

        except Exception as e:
            logger.error(f"Error loading {file_path}: {e}")

        return documents
