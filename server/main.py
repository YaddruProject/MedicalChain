import uvicorn
from MedicalChain import app, scheduler


def main():
    scheduler.start()
    for _ in range(5):
        scheduler.get_job("throughput_job").func()
        scheduler.get_job("latency_job").func()
    uvicorn.run(app)


if __name__ == "__main__":
    main()
