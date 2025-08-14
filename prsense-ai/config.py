# config.py
import os
from dotenv import load_dotenv
from pathlib import Path

# Get absolute path to the .env file inside prsense-ai/
dotenv_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

class Config:
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    PYTHON_SERVICE_QUEUE = os.getenv("PYTHON_SERVICE_QUEUE", "prsense-ai")
    NODE_SERVICE_QUEUE = os.getenv("NODE_SERVICE_QUEUE", "prsense-node")
