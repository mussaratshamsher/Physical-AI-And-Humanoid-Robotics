from typing import List
import google.generativeai as genai
from qdrant_client import QdrantClient
from app.config import Config
import asyncio

async def get_embeddings(text: str) -> List[float]:
    """Generates embeddings for the given text using the specified model."""
    try:
        # Using synchronous call in an async wrapper to avoid async issues with genai
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: genai.embed_content(
                model=Config.EMBEDDING_MODEL,
                content=text,
                task_type="RETRIEVAL_QUERY"
            )
        )
        return response["embedding"]
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        raise

async def rag_search(query: str) -> str:
    """
    Performs a RAG search on the Qdrant collection using the user query.
    Use this tool to find relevant context from the Humanoid Robotics textbook
    to answer a user's question. The input should be the user's original question.
    The tool will return relevant text chunks from the book.

    Returns the top 3 chunk texts as context.
    """
    try:
        # Initialize Qdrant client
        qdrant_client = QdrantClient(
            url=Config.QDRANT_URL,
            api_key=Config.QDRANT_API_KEY,
            timeout=30  # Add timeout to prevent hanging
        )

        # Generate embeddings for the query
        query_embedding = await get_embeddings(query)

        # Search Qdrant
        search_result = qdrant_client.search(
            collection_name=Config.QDRANT_COLLECTION_NAME,
            query_vector=query_embedding,
            limit=3  # Return top 3 results
        )

        # Extract text from search results
        context_texts = []
        for hit in search_result:
            if hit.payload and "text" in hit.payload:
                context_texts.append(hit.payload["text"])

        if not context_texts:
            return "No relevant context found in the textbook."

        return "\n\n".join(context_texts)

    except Exception as e:
        print(f"Error during RAG search: {e}")
        return f"An error occurred during RAG search: {str(e)}"
