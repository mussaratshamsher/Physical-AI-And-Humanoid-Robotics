from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.agent import run_agent
from app.config import Config
import uvicorn

app = FastAPI(
    title="Humanoid Robotics Textbook Tutor Agent",
    description="An AI agent that answers questions about humanoid robotics from a RAG database.",
    version="0.1.0",
)

# --- Add CORS Middleware ---
# This is crucial for allowing your Vercel frontend to communicate with this API.
# You should restrict the origins to your actual Vercel deployment URL in production.
# For Railway deployment, we'll use environment variable to configure allowed origins
import os
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []
# Add default origins for local development and production
origins = [
    "http://localhost",
    "http://localhost:3000", # Common for local Docusaurus dev
    "https://physical-ai-and-humanoid-robotics-bice.vercel.app/", # Your Vercel deployment
    "https://*.vercel.app"  # Allow all vercel domains in case of subdomains
] + [origin for origin in allowed_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

@app.post("/agent/chat")
async def chat_with_agent(request: ChatRequest):
    """
    Endpoint to chat with the TextbookTutorAgent.
    It takes a query and returns the agent's final answer.
    """
    # The openai-agents Runner returns the full response, not a stream.
    final_answer = await run_agent(request.query)
    return {"response": final_answer}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    # Ensure all configurations are valid before starting the app
    try:
        Config.validate()
        print("Configuration validated successfully.")
    except ValueError as e:
        print(f"Configuration Error: {e}")
        exit(1)

    # You can run this file directly for testing, but typically uvicorn is started from the command line
    uvicorn.run(app, host="0.0.0.0", port=8000)
