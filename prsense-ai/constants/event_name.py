from enum import Enum

class EventName(Enum):
    CHUNK = "chunk"
    EMBEDDING_RESULT = "embeddings_result"

class EventNameForPush(Enum):
    CHUNK = "chunk"
    EMBEDDING_RESULT = "embeddings_result"
