from agents import Agent, Runner, AsyncOpenAI, RunConfig, OpenAIChatCompletionsModel
from app.config import Config
from app.tools import rag_search

# 1. Configure the LLM (Gemini via OpenAI-compatible endpoint)
# This client points to Google's API but uses the OpenAI library structure,
# which is what the `openai-agents` SDK expects.
external_client = AsyncOpenAI(
    api_key=Config.GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# 2. Define the model for the agent to use
model = OpenAIChatCompletionsModel(
    model=Config.MODEL_NAME,  # e.g., "gemini-1.5-flash"
    openai_client=external_client
)

# 3. Create the agent with instructions and tools
# The agent will use the `rag_search` function when it needs to find
# information from the textbook to answer a question.
textbook_tutor_agent = Agent(
    name="TextbookTutor",
    instructions=(
        "You are a helpful AI assistant and expert tutor for a Humanoid Robotics textbook. "
        "Your goal is to answer the user's questions based on the content of the book. "
        "First, use the `rag_search` tool with the user's question to find relevant context from the textbook. "
        "Then, use the retrieved context to formulate a clear, concise, and accurate answer. "
        "If the context does not contain the answer, state that the information is not available in the textbook. "
        "Do not use any prior knowledge outside of the provided context."
    ),
    tools=[rag_search]
)

# 4. Define the runner configuration
run_config = RunConfig(
    model=model,
    model_provider=external_client,
    tracing_disabled=True  # Set to False for debugging if needed
)

async def run_agent(query: str) -> str:
    """Runs the agent with the given query and returns the final output."""
    result = await Runner.run(textbook_tutor_agent, input=query, run_config=run_config)
    # The `openai-agents` Runner doesn't stream the final answer, it returns a complete result.
    return result.final_output