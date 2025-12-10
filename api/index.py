from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import google.generativeai as genai
from qdrant_client import QdrantClient, models
import asyncio
import json

# --- Configuration ---
load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not all([QDRANT_URL, QDRANT_API_KEY, GEMINI_API_KEY]):
    raise ValueError("One or more required environment variables are not set for the API. Please check your .env file.")

genai.configure(api_key=GEMINI_API_KEY)

# Constants
COLLECTION_NAME = "humanoid_robotics_textbook"
EMBEDDING_MODEL = "models/text-embedding-004"
GENERATIVE_MODEL = "gemini-pro" # Using gemini-pro for chat

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from your Docusaurus frontend
# Adjust allow_origins in production to be more restrictive
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins, change to your Docusaurus URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Qdrant client
qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# --- Endpoints ---

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Basic root endpoint for health check."""
    return """
    <h1>FastAPI Backend for Humanoid Robotics Textbook</h1>
    <p>This is the backend for the RAG chatbot, translation, and personalization features.</p>
    <p>Check the <code>/api/chat</code> endpoint for the chatbot functionality.</p>
    """

@app.post("/api/chat")
async def chat(request: Request):
    """
    RAG Chatbot endpoint.
    Receives a user query, retrieves context from Qdrant, and streams a response from Gemini.
    """
    try:
        body = await request.json()
        user_query = body.get("query", "")
        if not user_query:
            raise HTTPException(status_code=400, detail="Query parameter is missing")

        # 1. Generate embedding for the user query
        query_embedding_response = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=user_query,
            task_type="RETRIEVAL_QUERY"
        )
        query_embedding = query_embedding_response['embedding']

        # 2. Search Qdrant for relevant context
        search_result = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=3 # Retrieve top 3 relevant chunks
        )

        context = []
        for hit in search_result:
            if hit.payload and 'text' in hit.payload: # Assuming chunk text is stored in 'text' payload
                 context.append(hit.payload['text'])
            else:
                 # If 'text' is not directly in payload, we need to fetch it from the original document
                 # For now, let's assume 'text' is part of the payload as a placeholder.
                 # In a real scenario, you'd store the actual chunk text in the payload.
                 # For this example, let's just use the markdown file as a source for context.
                 # This is a simplification; ideally, the chunk content is directly in Qdrant payload.
                 pass # Fallback to simply using the source if no text payload, or handle as needed
        
        # If no 'text' payload in Qdrant, we need to adapt.
        # Let's adjust ingest.py to store the chunk's text in the payload.
        # The current ingest.py doesn't store the chunk text in payload, only source and chunk_index.
        # This will need correction in ingest.py to properly retrieve text here.
        # For this draft, if context is empty, the LLM will respond without specific RAG context.

        # 3. Construct prompt for Gemini
        system_instruction = "You are a helpful AI assistant for the 'Humanoid Robotics Textbook'. Answer the user's question based ONLY on the provided context. If the answer is not in the context, state that you cannot answer from the provided information."
        
        if context:
            context_str = "\n\n".join(context)
            prompt_parts = [
                f"{system_instruction}\n\nContext:\n{context_str}\n\nQuestion:\n{user_query}\n\nAnswer:"
            ]
        else:
            prompt_parts = [
                f"{system_instruction}\n\nQuestion:\n{user_query}\n\nAnswer: (No specific context found, providing a general answer related to robotics if possible)"
            ]


        # 4. Stream response from Gemini
        model = genai.GenerativeModel(GENERATIVE_MODEL)
        
        # Generator for streaming response
        async def generate_and_stream():
            try:
                response_stream = await asyncio.to_thread(
                    model.generate_content,
                    prompt_parts,
                    stream=True
                )
                for chunk in response_stream:
                    if chunk.text:
                        yield json.dumps({"text": chunk.text}) + "\n"
                    await asyncio.sleep(0.01) # Small delay to yield control
            except Exception as e:
                yield json.dumps({"error": f"Error generating content: {str(e)}"}) + "\n"

        return StreamingResponse(generate_and_stream(), media_type="application/json")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Placeholder for translation endpoint
@app.post("/api/translate")
async def translate_text(request: Request):
    """Placeholder for translation endpoint."""
    body = await request.json()
    text = body.get("text", "")
    target_language = body.get("target_language", "English")
    return {"translated_text": f"Translated '{text}' to {target_language} (placeholder)"}

# Placeholder for personalization endpoint
@app.post("/api/personalize")
async def personalize_user(request: Request):
    """Placeholder for personalization endpoint."""
    body = await request.json()
    interests = body.get("interests", [])
    return {"message": f"User interests recorded: {interests} (placeholder)"}