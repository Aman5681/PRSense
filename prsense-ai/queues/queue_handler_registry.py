from constants.event_name import EventName

class QueueHandlerRegistry:
    def __init__(self, event_handler):
        self.handlers = {
            EventName.CHUNK.value: event_handler.handle_chunk,
            EventName.EMBEDDING_RESULT.value: event_handler.handle_embedding_result,
        }

    def get_handler(self, event_name):
        return self.handlers.get(event_name) 