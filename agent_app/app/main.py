from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn
from app.agent import TextbookTutorAgent
from app.config import Config
import asyncio

app = FastAPI(
    title="Humanoid Robotics Textbook Tutor Agent",
    description="An AI agent that answers questions about humanoid robotics from a RAG database.",
    version="0.1.0",
)

class ChatRequest(BaseModel):
    query: str

@app.post("/agent/chat")
async def chat_with_agent(request: ChatRequest):
    """
    Endpoint to chat with the TextbookTutorAgent.
    It takes a query and streams back the agent's response.
    """
    agent = TextbookTutorAgent()

    async def generate_response():
        async for chunk in agent.run(request.query):
            yield chunk

    return StreamingResponse(generate_response(), media_type="text/event-stream")

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
