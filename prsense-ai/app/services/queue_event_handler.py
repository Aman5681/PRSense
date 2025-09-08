from constants.event_name import EventNameForPush
from queues.queue_manager import QueueManager
class QueueEventHandler:

    _instance = None

    def __call__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(QueueEventHandler).__call__(*args, **kwargs)
        return cls._instance
    
    def __init__(self, queue_manager=None):
        if hasattr(self, "_initialized") and self._initialized:
            return  # prevent reinit on singleton
        self.queue_manager = QueueManager(self)
    
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

