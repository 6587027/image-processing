from fastapi import APIRouter, File, UploadFile, HTTPException
from app.core.config import settings
import os
import uuid
from pathlib import Path
import shutil

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...), permanent: bool = False):
    """
    Upload image
    permanent=True: บันทึกใน uploads/ (รูปถาวร)
    permanent=False: บันทึกใน temp/ (รูปชั่วคราว สำหรับ search)
    """
    try:
        file_ext = Path(file.filename).suffix.lower()
        
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file_ext} not allowed"
            )
        
        file_id = str(uuid.uuid4())
        filename = f"{file_id}{file_ext}"
        
        # เลือก directory ตาม parameter
        target_dir = settings.UPLOAD_DIR if permanent else settings.TEMP_DIR
        os.makedirs(target_dir, exist_ok=True)
        
        file_path = os.path.join(target_dir, filename)
        
        contents = await file.read()
        
        if len(contents) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum"
            )
        
        with open(file_path, "wb") as f:
            f.write(contents)
        
        return {
            "image_id": file_id,
            "filename": filename,
            "url": f"/{target_dir}/{filename}",
            "message": "File uploaded successfully",
            "permanent": permanent
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload/batch")
async def upload_batch_images(files: list[UploadFile] = File(...)):
    """Upload หลายรูปพร้อมกัน (บันทึกถาวรใน uploads/)"""
    results = []
    
    for file in files:
        try:
            result = await upload_image(file, permanent=True)
            results.append(result)
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return {
        "total": len(files),
        "success": len([r for r in results if "error" not in r]),
        "results": results
    }

@router.delete("/temp/clear")
async def clear_temp_folder():
    """ลบรูปทั้งหมดใน temp folder"""
    try:
        temp_dir = settings.TEMP_DIR
        
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
            os.makedirs(temp_dir, exist_ok=True)
            
        return {
            "message": "Temp folder cleared successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/images")
async def list_images():
    """แสดงเฉพาะรูปถาวรใน uploads/"""
    try:
        upload_dir = settings.UPLOAD_DIR
        
        if not os.path.exists(upload_dir):
            return {
                'images': [],
                'total': 0
            }
        
        image_files = [
            f for f in os.listdir(upload_dir)
            if any(f.lower().endswith(ext) for ext in settings.ALLOWED_EXTENSIONS)
        ]
        
        images = [
            {
                'filename': f,
                'image_id': f.split('.')[0],
                'url': f'/uploads/{f}'
            }
            for f in image_files
        ]
        
        return {
            'images': images,
            'total': len(images)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))