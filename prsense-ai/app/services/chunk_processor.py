from constants.event_name import EventNameForPush

class ChunkProcessorTask:
    def __init__(self, pusher):
        self.pusher = pusher

    def process_chunk(self, payload):
        print(f"[ChunkProcessorTask] Processing chunk: {payload}")
        embedding = {
            "vector": [0.1, 0.2, 0.3],
            "metadata": payload
        }
        # self.pusher.push(EventNameForPush.EMBEDDING_RESULT.value, embedding)
        return {"status": "processed", "payload": embedding}
