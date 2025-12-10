from typing import List, Dict
import google.generativeai as genai
from qdrant_client import QdrantClient
from qdrant_client.http.models import models
from app.config import Config

# Configure Google Generative AI
genai.configure(api_key=Config.GOOGLE_API_KEY)

async def get_embeddings(text: str) -> List[float]:
    """Generates embeddings for the given text using the specified model."""
    try:
        response = genai.embed_content(
            model=Config.EMBEDDING_MODEL,
            content=text,
            task_type="RETRIEVAL_QUERY"
        )
        return response["embedding"]
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        raise

async def rag_search(query: str) -> str:
    """
    Performs a RAG search on the Qdrant collection using the user query.
    Returns the top 3 chunk texts as context.
    """
    try:
        qdrant_client = QdrantClient(url=Config.QDRANT_URL, api_key=Config.QDRANT_API_KEY)

        # Generate embeddings for the query
        query_embedding = await get_embeddings(query)

        # Search Qdrant
        search_result = qdrant_client.search(
            collection_name=Config.QDRANT_COLLECTION_NAME,
            query_vector=query_embedding,
            limit=3 # Return top 3 results
        )

        context_texts = [hit.payload["text"] for hit in search_result if "text" in hit.payload]

        if not context_texts:
            return "No relevant context found."

        return "\n\n".join(context_texts)

    except Exception as e:
        print(f"Error during RAG search: {e}")
        return f"An error occurred during RAG search: {e}"

