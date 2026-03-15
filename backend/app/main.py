from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import spending, teller

app = FastAPI(title="LedgerWise API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teller.router, prefix="/api/v1")
app.include_router(spending.router, prefix="/api/v1")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
