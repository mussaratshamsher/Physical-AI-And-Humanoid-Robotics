import os
import re
from pathlib import Path
from dotenv import load_dotenv
import markdown
from qdrant_client import QdrantClient, models
import google.generativeai as genai
import time
import numpy as np # Import numpy
import uuid # Import uuid

# --- Configuration ---
load_dotenv()

# Get API keys from environment variables
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not all([QDRANT_URL, QDRANT_API_KEY, GEMINI_API_KEY]):
    raise ValueError("One or more required environment variables are not set. Please check your .env file.")

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Constants
COLLECTION_NAME = "humanoid_robotics_textbook"
EMBEDDING_MODEL = "models/text-embedding-004"
DOCS_PATH = Path("docs")

# --- Helper Functions ---

def get_all_docs(path: Path):
    """Finds all markdown files in the specified directory."""
    print(f"Scanning for markdown files in '{path}'...")
    return list(path.glob("**/*.md"))

def chunk_text(text: str, chunk_size: int = 800, chunk_overlap: int = 100):
    """Splits text into smaller, overlapping chunks."""
    if not text:
        return []
    
    # Simple split by paragraphs first
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) + 2 < chunk_size:
            current_chunk += paragraph + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = paragraph + "\n\n"
    
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

def get_embeddings(texts: list[str]):
    """Generates embeddings for a list of texts using the Gemini API."""
    print(f"Generating embeddings for {len(texts)} chunks...")
    try:
        all_embeddings = []
        # Gemini API has a rate limit, so we process in batches with delays
        # and handle potential empty embedding results for specific content
        for i in range(0, len(texts), 50): # Process 50 texts at a time
            batch_texts = texts[i:i+50]
            # Filter out any empty strings that might cause issues with embedding
            non_empty_batch_texts = [text for text in batch_texts if text.strip()]
            
            if not non_empty_batch_texts:
                print(f"  - Skipping empty batch {i//50 + 1}...")
                continue
                
            result = genai.embed_content(
                model=EMBEDDING_MODEL,
                content=non_empty_batch_texts,
                task_type="RETRIEVAL_DOCUMENT"
            )
            # Ensure we only append valid embeddings and handle cases where
            # the number of returned embeddings might not match non_empty_batch_texts
            if result and 'embedding' in result and result['embedding']:
                all_embeddings.extend(result['embedding'])
                print(f"  - Embedded batch {i//50 + 1}. Added {len(result['embedding'])} embeddings.")
            else:
                print(f"  - Warning: Empty or invalid embedding result for batch {i//50 + 1}.")
            time.sleep(1) # Sleep for 1 second to respect rate limits
        return all_embeddings
    except Exception as e:
        print(f"An error occurred while generating embeddings: {e}")
        return []

# --- Main Ingestion Logic ---

def main():
    """Main function to run the ingestion process."""
    print("--- Starting Content Ingestion ---")

    # 1. Initialize Qdrant Client
    print("Connecting to Qdrant...")
    print(f"  Qdrant URL: {QDRANT_URL}")
    print(f"  Qdrant API Key (masked): {QDRANT_API_KEY[:4]}...{QDRANT_API_KEY[-4:]}")
    
    try:
        qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        
        # Test basic connectivity by listing collections
        print("  Attempting to list Qdrant collections (test connectivity)...")
        collections = qdrant_client.get_collections()
        print(f"  Successfully connected to Qdrant. Found {len(collections.collections)} existing collections.")
        
    except Exception as e:
        print(f"Failed to connect to Qdrant or list collections: {e}")
        print("Please double-check your QDRANT_URL and QDRANT_API_KEY in the .env file.")
        return

    # 2. Create or Recreate Qdrant Collection
    print(f"Setting up Qdrant collection: '{COLLECTION_NAME}'")
    qdrant_client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(
            size=768,  # Size for Gemini's text-embedding-004
            distance=models.Distance.COSINE
        )
    )

    # 3. Read and Process Documents
    markdown_files = get_all_docs(DOCS_PATH)
    if not markdown_files:
        print("No markdown files found. Exiting.")
        return

    all_chunks = []
    all_metadata = []

    for doc_path in markdown_files:
        print(f"Processing document: {doc_path}")
        with open(doc_path, 'r', encoding='utf-8') as f:
            # Convert markdown to plain text
            html = markdown.markdown(f.read())
            # A simple way to strip HTML tags
            text = re.sub('<[^<]+?>', '', html)
            
        chunks = chunk_text(text)
        for i, chunk in enumerate(chunks):
            # Only add non-empty chunks
            if chunk.strip():
                all_chunks.append(chunk)
                all_metadata.append({
                    "source": str(doc_path),
                    "chunk_index": i,
                    "text": chunk  # Add the actual text content here
                })
            else:
                print(f"  - Warning: Skipping empty chunk from {doc_path} at index {i}.")
    
    if not all_chunks:
        print("No text chunks were created. Exiting.")
        return

    # 4. Generate Embeddings
    embeddings = get_embeddings(all_chunks)
    
    if not embeddings:
        print("Failed to generate embeddings or embeddings list is empty. Aborting.")
        return

    # Debug prints for embeddings
    print(f"  Total embeddings generated: {len(embeddings)}")
    print(f"  Total metadata items: {len(all_metadata)}")
    if embeddings and isinstance(embeddings, list) and isinstance(embeddings[0], list):
        print(f"  First embedding type: {type(embeddings[0])}, length: {len(embeddings[0])}")
    else:
        print(f"  Embeddings structure not as expected: {type(embeddings)}")
    
    # Ensure a 1:1 mapping between embeddings and metadata
    if len(embeddings) != len(all_metadata):
        print(f"Error: Mismatch between number of embeddings ({len(embeddings)}) and metadata ({len(all_metadata)}). Adjusting...")
        min_len = min(len(embeddings), len(all_metadata))
        embeddings = embeddings[:min_len]
        all_metadata = all_metadata[:min_len]
        print(f"  Adjusted lengths to: {min_len}")

    # Generate UUIDs for each point
    point_ids = [str(uuid.uuid4()) for _ in range(len(embeddings))]

    # 5. Upsert into Qdrant
    print("Upserting data into Qdrant...")
    try:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=models.Batch(
                ids=point_ids,  # Provide generated UUIDs
                vectors=embeddings,
                payloads=all_metadata
            ),
            wait=True
        )
    except Exception as e:
        print(f"An error occurred during Qdrant upsert: {e}")
        return

    print("--- Content Ingestion Complete! ---")
    print(f"Successfully upserted {len(embeddings)} text chunks into the '{COLLECTION_NAME}' collection.")

if __name__ == "__main__":
    main()