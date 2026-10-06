import os
import uuid
from typing import List

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.registration_document import RegistrationDocument

# Lives under the persistent disk mount, same as excel/invoices
UPLOAD_DIR = "/opt/render/project/src/backend/uploads/registration_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx', '.txt'}
MAX_FILES = 10
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB per file


class RegistrationDocumentService:

    @staticmethod
    def validate_files(files: List[UploadFile]) -> List[UploadFile]:
        """Check count and file types before anything is written."""
        files = [f for f in (files or []) if f and f.filename]

        if len(files) > MAX_FILES:
            raise HTTPException(status_code=400, detail=f"You can upload at most {MAX_FILES} documents.")

        for f in files:
            ext = os.path.splitext(f.filename)[1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail=f"'{f.filename}' is not an allowed file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
                )
        return files

    @staticmethod
    def save_files(db: Session, registration_id, files: List[UploadFile]) -> None:
        """Write files to disk and add DB rows (caller commits).
        If anything fails, files already written are removed."""
        saved_paths = []
        try:
            for upload in files:
                ext = os.path.splitext(upload.filename)[1].lower()
                stored_name = f"{registration_id}_{uuid.uuid4().hex}{ext}"
                dest_path = os.path.join(UPLOAD_DIR, stored_name)

                size = 0
                with open(dest_path, "wb") as out:
                    saved_paths.append(dest_path)
                    while True:
                        chunk = upload.file.read(1024 * 1024)
                        if not chunk:
                            break
                        size += len(chunk)
                        if size > MAX_FILE_SIZE:
                            raise HTTPException(
                                status_code=400,
                                detail=f"'{upload.filename}' is larger than {MAX_FILE_SIZE // (1024 * 1024)} MB."
                            )
                        out.write(chunk)

                db.add(RegistrationDocument(
                    registration_id=registration_id,
                    original_filename=os.path.basename(upload.filename)[:255],
                    stored_path=dest_path,
                    content_type=upload.content_type,
                    file_size=size
                ))
        except Exception:
            for path in saved_paths:
                try:
                    os.remove(path)
                except OSError:
                    pass
            raise

    @staticmethod
    def delete_files_for_registration(db: Session, registration_id) -> None:
        """Remove files from disk (DB rows go away via ON DELETE CASCADE)."""
        docs = db.query(RegistrationDocument).filter(
            RegistrationDocument.registration_id == registration_id
        ).all()
        for doc in docs:
            try:
                os.remove(doc.stored_path)
            except OSError:
                pass