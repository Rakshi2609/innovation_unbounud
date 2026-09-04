import os
import shutil
import re
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.config import settings

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


class CreatePolicyRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="Policy Title")
    category: str = Field("General Underwriting", description="Policy Category")
    content: str = Field(..., min_length=10, description="Policy Content in Markdown or plain text")


@router.get("")
def list_indexed_documents(request: Request):
    orchestrator = request.app.state.orchestrator
    files = orchestrator.policy_store.get_indexed_files()
    
    docs_details = []
    for fname in files:
        fpath = os.path.join(settings.policies_dir, fname)
        size_kb = round(os.path.getsize(fpath) / 1024, 1) if os.path.exists(fpath) else 0
        
        # Count chunks in store for this file
        chunk_count = sum(1 for d in orchestrator.policy_store.documents if d.metadata.get("source_file") == fname)
        
        # Sample first 200 chars for preview
        preview = ""
        if os.path.exists(fpath):
            try:
                with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                    preview = f.read(300).strip()
            except Exception:
                preview = ""

        docs_details.append({
            "filename": fname,
            "title": fname.replace(".md", "").replace("_", " ").title(),
            "size_kb": size_kb,
            "chunks_count": chunk_count or 1,
            "preview": preview,
            "is_custom": not fname.startswith(("hardship_", "lending_", "gig_", "fraud_"))
        })

    return {
        "documents": files,
        "details": docs_details,
        "count": len(files),
        "total_chunks": len(orchestrator.policy_store.documents)
    }


@router.get("/{filename}")
def get_policy_document(filename: str):
    fpath = os.path.join(settings.policies_dir, filename)
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail=f"Policy document '{filename}' not found.")
    
    try:
        with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return {
            "filename": filename,
            "title": filename.replace(".md", "").replace("_", " ").title(),
            "content": content,
            "size_bytes": os.path.getsize(fpath)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not read document: {e}")


@router.post("/create")
async def create_policy_document(
    payload: CreatePolicyRequest,
    request: Request
):
    # Sanitize title for filename
    clean_name = re.sub(r"[^a-zA-Z0-9_]+", "_", payload.title.strip().lower()).strip("_")
    if not clean_name:
        clean_name = "custom_policy"
    filename = f"{clean_name}.md"
    save_path = os.path.join(settings.policies_dir, filename)
    os.makedirs(settings.policies_dir, exist_ok=True)

    formatted_md = f"""# {payload.title}
**Category:** {payload.category}
**Status:** Active Institutional Policy
**Jurisdiction:** Reserve Bank of India / Commercial Lending Framework

---

## 1. Scope & Guidelines
{payload.content}
"""

    with open(save_path, "w", encoding="utf-8") as f:
        f.write(formatted_md)

    orchestrator = request.app.state.orchestrator
    chunks_added = orchestrator.policy_store.index_file(save_path)

    return {
        "status": "success",
        "filename": filename,
        "title": payload.title,
        "chunks_indexed": chunks_added,
        "message": f"Successfully indexed '{payload.title}' into the real-time RAG store ({chunks_added} semantic chunks)."
    }


@router.post("/upload")
async def upload_policy_document(
    request: Request,
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith((".pdf", ".md", ".txt", ".csv", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported document format. Allowed: PDF, MD, TXT, CSV, DOCX.")

    save_path = os.path.join(settings.policies_dir, file.filename)
    os.makedirs(settings.policies_dir, exist_ok=True)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    orchestrator = request.app.state.orchestrator
    chunks_added = orchestrator.policy_store.index_file(save_path)
    return {
        "status": "success",
        "filename": file.filename,
        "chunks_indexed": chunks_added,
        "message": f"Successfully uploaded and indexed '{file.filename}' into RAG store."
    }


@router.delete("/{filename}")
def delete_policy_document(filename: str, request: Request):
    fpath = os.path.join(settings.policies_dir, filename)
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail=f"Policy '{filename}' not found.")

    try:
        os.remove(fpath)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {e}")

    # Re-index all documents
    orchestrator = request.app.state.orchestrator
    orchestrator.policy_store.documents = []
    orchestrator.policy_store._indexed_files = set()
    total_indexed = orchestrator.policy_store.index_directory(settings.policies_dir)

    return {
        "status": "success",
        "message": f"Deleted '{filename}' and re-indexed policy knowledge base ({total_indexed} chunks remaining)."
    }

