from typing import List

from fastapi import APIRouter, HTTPException
from MedicalChain.config import Config
from MedicalChain.models import Analytics

router = APIRouter(prefix="/analytics", tags=["analytics"])

web3, contract = Config.setupWeb3()


@router.get("/throughput", response_model=List[Analytics])
async def calculate_throughput():
    try:
        return Config.THROUGHPUT
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/latency", response_model=List[Analytics])
async def measure_latency():
    try:
        return Config.LATENCY
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
