import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")  # Fallback to GOOGLE_API_KEY if not set
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY") # Optional
    QDRANT_COLLECTION_NAME = "humanoid_robotics_textbook"
    EMBEDDING_MODEL = "models/text-embedding-004"
    GENERATIVE_MODEL = "gemini-1.5-pro-latest"  # Updated to a more current model
    MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-pro-latest")  # Added for the agent

    @classmethod
    def validate(cls):
        if not cls.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY not set in .env file")
        if not cls.QDRANT_URL:
            raise ValueError("QDRANT_URL not set in .env file")
        if not cls.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not set in .env file")

Config.validate()
