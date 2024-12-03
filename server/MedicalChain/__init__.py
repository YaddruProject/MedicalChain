from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from MedicalChain.helpers.analytics import calculate_throughput, measure_latency
from MedicalChain.routes import analytics_router

__version__ = "1.0.0"

app = FastAPI(title="MedicalChain API", version=__version__)

scheduler = BackgroundScheduler()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    return {"message": f"MedicalChain v{__version__} is up"}


scheduler.add_job(calculate_throughput, "interval", hours=4, id="throughput_job")
scheduler.add_job(measure_latency, "interval", hours=4, id="latency_job")
app.include_router(analytics_router)
