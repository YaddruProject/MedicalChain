from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

__version__ = "1.0.0"

app = FastAPI(title="MedicalChain API", version=__version__)

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
