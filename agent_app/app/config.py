import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY") # Optional
    QDRANT_COLLECTION_NAME = "humanoid_robotics_textbook"
    EMBEDDING_MODEL = "models/text-embedding-004"
    GENERATIVE_MODEL = "gemini-pro"

    @classmethod
    def validate(cls):
        if not cls.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY not set in .env file")
        if not cls.QDRANT_URL:
            raise ValueError("QDRANT_URL not set in .env file")

Config.validate()
