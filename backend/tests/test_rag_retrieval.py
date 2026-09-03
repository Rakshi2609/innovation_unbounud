import pytest
import asyncio
from app.rag.loaders import Document, DocumentLoader
from app.rag.chunker import FinancialChunker
from app.rag.store import FinancialPolicyStore
from app.rag.reranker import CrossEncoderReranker
from app.core.config import settings

def test_pii_redaction():
    raw_text = "Customer email is john.doe@bank.com, SSN is 123-45-6789, phone is +1-555-019-2834."
    redacted = DocumentLoader.redact_pii(raw_text)
    assert "[REDACTED_EMAIL]" in redacted
    assert "[REDACTED_SSN]" in redacted
    assert "[REDACTED_PHONE]" in redacted
    assert "john.doe@bank.com" not in redacted
    assert "123-45-6789" not in redacted

@pytest.mark.asyncio
async def test_policy_store_indexing_and_search():
    store = FinancialPolicyStore(collection_name="test_policies")
    chunks = store.index_directory(settings.policies_dir)
    assert chunks > 0
    assert len(store.get_indexed_files()) >= 4

    results = await store.search("What is the maximum debt to income DTI limit for unsecured credit?")
    assert len(results) > 0
    top_doc = results[0]
    assert "debt" in top_doc.page_content.lower() or "dti" in top_doc.page_content.lower()

def test_reranker_scoring():
    reranker = CrossEncoderReranker()
    docs = [
        Document(page_content="The maximum acceptable Debt-to-Income DTI ratio is 45 percent."),
        Document(page_content="Transactions with low device trust score require biometric authentication.")
    ]
    top_docs, scores = reranker.rerank("debt to income DTI limit", docs, top_k=1)
    assert len(top_docs) == 1
    assert "debt" in top_docs[0].page_content.lower()
