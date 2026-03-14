from __future__ import annotations

import os
import shutil
import tempfile
from typing import List
from uuid import uuid4

from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pypdf import PdfReader, PdfWriter

app = FastAPI()

raw_origins = os.getenv(
    "FRONTEND_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _create_temp_dir() -> str:
    return tempfile.mkdtemp(prefix="pdfpilot_")


def _is_pdf(upload: UploadFile) -> bool:
    if upload.content_type == "application/pdf":
        return True
    return upload.filename.lower().endswith(".pdf")


def _save_uploads(temp_dir: str, uploads: List[UploadFile]) -> List[str]:
    saved_paths: List[str] = []
    for upload in uploads:
        if not _is_pdf(upload):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        suffix = os.path.splitext(upload.filename)[-1] or ".pdf"
        unique_name = f"{uuid4().hex}{suffix}"
        file_path = os.path.join(temp_dir, unique_name)
        with open(file_path, "wb") as out_file:
            shutil.copyfileobj(upload.file, out_file)
        saved_paths.append(file_path)
    return saved_paths


def _cleanup(path: str) -> None:
    if os.path.isdir(path):
        shutil.rmtree(path, ignore_errors=True)
    elif os.path.isfile(path):
        try:
            os.remove(path)
        except FileNotFoundError:
            return


@app.get("/")
async def root():
    return {"status": "PDFPilot API running"}


@app.post("/merge")
async def merge_pdfs(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Upload at least two PDFs.")

    temp_dir = _create_temp_dir()
    try:
        saved_paths = _save_uploads(temp_dir, files)
        output_path = os.path.join(temp_dir, f"merged_{uuid4().hex}.pdf")

        merger = PdfWriter()
        try:
            for path in saved_paths:
                merger.append(path)
            with open(output_path, "wb") as out_file:
                merger.write(out_file)
        finally:
            merger.close()

        background_tasks.add_task(_cleanup, temp_dir)
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename="pdfpilot-merged.pdf",
        )
    except HTTPException:
        _cleanup(temp_dir)
        raise
    except Exception as exc:
        _cleanup(temp_dir)
        raise HTTPException(status_code=400, detail=f"Failed to merge PDFs: {exc}")


@app.post("/split")
async def split_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    pages: str = Form(...),
):
    if not _is_pdf(file):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    page_numbers: List[int] = []
    for raw in pages.split(","):
        raw = raw.strip()
        if not raw:
            continue
        if not raw.isdigit():
            raise HTTPException(
                status_code=400,
                detail="Page numbers must be a comma-separated list of integers.",
            )
        page_numbers.append(int(raw))

    if not page_numbers:
        raise HTTPException(status_code=400, detail="Provide at least one page number.")

    temp_dir = _create_temp_dir()
    try:
        saved_paths = _save_uploads(temp_dir, [file])
        source_path = saved_paths[0]
        output_path = os.path.join(temp_dir, f"split_{uuid4().hex}.pdf")

        reader = PdfReader(source_path)
        total_pages = len(reader.pages)

        for page in page_numbers:
            if page < 1 or page > total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Page {page} is out of range. Document has {total_pages} pages.",
                )

        writer = PdfWriter()
        for page in page_numbers:
            writer.add_page(reader.pages[page - 1])

        with open(output_path, "wb") as out_file:
            writer.write(out_file)

        background_tasks.add_task(_cleanup, temp_dir)
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename="pdfpilot-split.pdf",
        )
    except HTTPException:
        _cleanup(temp_dir)
        raise
    except Exception as exc:
        _cleanup(temp_dir)
        raise HTTPException(status_code=400, detail=f"Failed to split PDF: {exc}")
