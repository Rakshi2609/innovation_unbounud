import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from typing import Optional, List
from app.core.config import settings

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])

@router.get("")
def list_indexed_documents(request: Request):
    orchestrator = request.app.state.orchestrator
    files = orchestrator.policy_store.get_indexed_files()
    return {"documents": files, "count": len(files)}

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
        "chunks_indexed": chunks_added
    }
