from config import Config
from constants.event_name import EventName, EventNameForPush

class PushConfig:
    def __init__(self):
        self.config = {
            EventNameForPush.EMBEDDING_RESULT.value: Config.PYTHON_SERVICE_QUEUE,
            EventName.CHUNK.value: Config.NODE_SERVICE_QUEUE,
        }

    def get_queue_name(self, event_name):
        return self.config.get(event_name)
