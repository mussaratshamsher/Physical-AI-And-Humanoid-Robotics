from typing import AsyncGenerator
import google.generativeai as genai
from app.config import Config
from app.tools import rag_search # Import the rag_search tool

class TextbookTutorAgent:
    def __init__(self):
        genai.configure(api_key=Config.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel(Config.GENERATIVE_MODEL)

    async def run(self, query: str) -> AsyncGenerator[str, None]:
        # 1. ALWAYS call rag_search first
        context = await rag_search(query)

        # 2. Construct the prompt with the retrieved context
        if context == "No relevant context found.":
            yield "I cannot answer this question as no relevant information was found in the textbook."
            return
        elif "An error occurred during RAG search:" in context:
            yield f"An error occurred while retrieving context: {context}"
            return

        prompt = (
            f"You are a helpful tutor for a Humanoid Robotics textbook. "
            f"Answer the following question STRICTLY from the provided context. "
            f"Do NOT use any outside knowledge. If the answer is not in the context, "
            f"state that you cannot answer based on the provided information.\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {query}\n\n"
            f"Answer:"
        )

        try:
            response = await self.model.generate_content_async(
                prompt,
                stream=True,
                generation_config=genai.GenerationConfig(
                    temperature=0.01, # Keep temperature low for factual answers
                )
            )

            async for chunk in response:
                yield chunk.text

        except Exception as e:
            print(f"Error during agent response generation: {e}")
            yield f"An error occurred while generating a response: {e}"

