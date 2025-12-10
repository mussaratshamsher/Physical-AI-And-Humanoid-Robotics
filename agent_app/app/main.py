import os
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
    try:
        print(f"Received query: {request.query[:50]}...")  # Log first 50 chars
        final_answer = await run_agent(request.query)
        print(f"Returning response: {final_answer[:50]}...")  # Log first 50 chars
        return {"response": final_answer}
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return {"response": f"Error processing your request: {str(e)}"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the application is running
    """
    try:
        # Verify configuration is loaded
        Config.validate()
        return {
            "status": "healthy",
            "service": "Humanoid Robotics Textbook Tutor Agent",
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@app.get("/config")
async def get_config():
    """
    Configuration endpoint for frontend apps to fetch API settings
    """
    return {
        "api_url": "/agent/chat",  # Relative path for internal use
        "service": "Humanoid Robotics Textbook Tutor Agent",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    # Ensure all configurations are valid before starting the app
    try:
        Config.validate()
        print("Configuration validated successfully.")
    except ValueError as e:
        print(f"Configuration Error: {e}")
        # Don't exit in production, let Railway handle it
        import sys
        if "pytest" not in sys.modules:  # Only exit if not running tests
            exit(1)

    # You can run this file directly for testing, but typically uvicorn is started from the command line
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)