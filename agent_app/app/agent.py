import google.generativeai as genai
from app.config import Config
from app.tools import rag_search
import asyncio

# Configure Google Generative AI
genai.configure(api_key=Config.GEMINI_API_KEY)

async def run_agent(query: str) -> str:
    """
    Runs the agent with the given query and returns the final output.
    This function implements a RAG-based agent that searches the textbook
    for relevant context before answering the user's question.
    """
    try:
        # First, search the RAG database for relevant context
        context = await rag_search(query)

        # Prepare the prompt with context
        system_instruction = (
            "You are a helpful AI assistant and expert tutor for a Humanoid Robotics textbook. "
            "Your goal is to answer the user's questions based on the provided context from the textbook. "
            "Use the retrieved context to formulate a clear, concise, and accurate answer. "
            "If the context does not contain the answer, state that the information is not available in the textbook. "
            "Do not use any prior knowledge outside of the provided context."
        )

        if context and context != "No relevant context found.":
            prompt = f"""
            {system_instruction}

            Context from textbook:
            {context}

            User's question: {query}

            Please provide a detailed answer based on the context provided.
            """
        else:
            prompt = f"""
            {system_instruction}

            User's question: {query}

            Note: No relevant context was found in the textbook for this question.
            Please acknowledge this limitation.
            """

        # Initialize the model
        model = genai.GenerativeModel(
            model_name=Config.MODEL_NAME,
            system_instruction=system_instruction
        )

        # Generate content
        response = await model.generate_content_async(prompt)

        # Return the response text
        return response.text if response.text else "I couldn't generate a response based on the provided context."

    except Exception as e:
        print(f"Error in run_agent: {str(e)}")
        return f"Sorry, I encountered an error processing your request: {str(e)}"