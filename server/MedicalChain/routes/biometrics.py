import os
from fastapi import APIRouter, HTTPException, UploadFile
from MedicalChain.helpers.deepface import verify_faces

from MedicalChain.models import Biometrics

router = APIRouter(prefix="/biometrics", tags=["biometrics"])

@router.post("/verify", response_model=Biometrics)
async def verify_face(img1: UploadFile, img2: UploadFile):
    try:
        img1_path = f"temp_{img1.filename}"
        img2_path = f"temp_{img2.filename}"
        with open(img1_path, "wb") as f:
            f.write(await img1.read())
        with open(img2_path, "wb") as f:
            f.write(await img2.read())
        result = verify_faces(img1_path, img2_path)
        os.remove(img1_path)
        os.remove(img2_path)
        return Biometrics(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
