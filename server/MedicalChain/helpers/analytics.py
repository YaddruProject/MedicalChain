import time
from MedicalChain.config import Config
from MedicalChain.models import Analytics

web3, contract = Config.setupWeb3()

def calculate_throughput():
    try:
        number_of_transactions = 5
        start_time = time.time()
        for _ in range(number_of_transactions):
            tx_hash = contract.functions.sendTransaction().transact()
            web3.eth.wait_for_transaction_receipt(tx_hash)
        end_time = time.time()
        duration_seconds = end_time - start_time
        throughput = number_of_transactions / duration_seconds
        if len(Config.THROUGHPUT) == 5:
            Config.THROUGHPUT.pop(0)
        Config.THROUGHPUT.append(Analytics(value=round(throughput, 4)))
    except Exception as e:
        raise Exception(str(e))


def measure_latency():
    try:
        start_time = time.time()
        tx_hash = contract.functions.sendTransaction().transact()
        web3.eth.wait_for_transaction_receipt(tx_hash)
        end_time = time.time()
        latency = (end_time - start_time) * 1000
        if len(Config.LATENCY) == 5:
            Config.LATENCY.pop(0)
        Config.LATENCY.append(Analytics(value=round(latency, 4)))
    except Exception as e:
        raise Exception(str(e))
