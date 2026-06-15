from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.damage import router as damage_router

app = FastAPI(
    title="AI Damage Detection Server",
    version="1.0.0"
)

# 🛠️ Define the permitted origins for CORS configuration
origins = ["*"]

# 🔓 Enable CORSMiddleware down the app chain
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allows access from your Vite development origin
    allow_credentials=True,         # Allows passing authorization cookies/headers if needed
    allow_methods=["*"],            # Allows all HTTP actions (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],            # Allows all custom incoming headers
)

# Include your AI system route routers
app.include_router(
    damage_router,
    prefix="/ai",
    tags=["Damage Detection"]
)

@app.get("/")
async def root():
    return {"message": "AI Engineering Inference core operating smoothly."}