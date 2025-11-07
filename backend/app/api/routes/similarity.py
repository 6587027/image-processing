from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.image_processor import ImageProcessor
from app.core.config import settings
import os

router = APIRouter()
image_processor = ImageProcessor()

class CompareRequest(BaseModel):
    source_image_id: str
    search_in_temp: bool = True

@router.post("/similarity/compare")
async def compare_images(request: CompareRequest):
    """
    Compare source image with images in uploads/
    search_in_temp=True: ค้นหา source จาก temp/
    search_in_temp=False: ค้นหา source จาก uploads/
    """
    try:
        # หา source image
        source_dir = settings.TEMP_DIR if request.search_in_temp else settings.UPLOAD_DIR
        
        source_files = [
            f for f in os.listdir(source_dir) 
            if f.startswith(request.source_image_id)
        ]
        
        if not source_files:
            raise HTTPException(status_code=404, detail="Source image not found")
        
        source_image_path = os.path.join(source_dir, source_files[0])
        
        # เปรียบเทียบกับรูปใน uploads/ เท่านั้น
        similar_images = image_processor.find_similar_images(
            source_image_path=source_image_path,
            image_directory=settings.UPLOAD_DIR,
            top_k=20
        )
        
        results = []
        for img_data in similar_images:
            filename = img_data['filename']
            image_id = filename.split('.')[0]
            
            results.append({
                'id': image_id,
                'filename': filename,
                'similarity': img_data['similarity'],
                'category': img_data['category'],
                'url': f"/uploads/{filename}"
            })
        
        return {
            'source_id': request.source_image_id,
            'results': results,
            'total_compared': len(results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))