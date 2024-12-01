import time

from fastapi import APIRouter, HTTPException
from MedicalChain.config import Config

router = APIRouter(prefix="/analytics", tags=["analytics"])

web3, contract = Config.setupWeb3()


@router.get("/throughput")
async def calculate_throughput():
    try:
        number_of_transactions = 3
        start_time = time.time()
        for _ in range(number_of_transactions):
            tx_hash = contract.functions.sendTransaction().transact()
            web3.eth.wait_for_transaction_receipt(tx_hash)
        end_time = time.time()
        duration_seconds = end_time - start_time
        throughput = number_of_transactions / duration_seconds
        return {"throughput": round(throughput, 4)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/latency")
async def measure_latency():
    try:
        start_time = time.time()
        tx_hash = contract.functions.sendTransaction().transact()
        web3.eth.wait_for_transaction_receipt(tx_hash)
        end_time = time.time()
        latency = (end_time - start_time) * 1000
        return {"latency": round(latency, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
