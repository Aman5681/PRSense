from constants.event_name import EventNameForPush

class QueueEventHandler:
    def __init__(self, queue_manager=None):
        self.queue_manager = queue_manager  # Will be set after instantiation

    async def handle_chunk(self, payload):
        print('[QueueEventHandler] Handling CHUNK:', payload)
        # Simulate processing...
        embedding_payload = {
            "vector": [0.1, 0.2, 0.3],  # Example embedding
            "metadata": payload
        }
        # Push to embeddings_result event
        if self.queue_manager:
            await self.queue_manager.push_message_to_queue(
                EventNameForPush.EMBEDDING_RESULT.value,
                embedding_payload
            )
            print("[QueueEventHandler] Pushed embedding result event.")

    async def handle_embedding_result(self, payload):
        print('[QueueEventHandler] Handling EMBEDDING_RESULT:', payload)
        # Add your embedding result processing logic here 