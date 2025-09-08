from config import EnvConfig
from constants.event_name import EventName, EventNameForPush
from services.queue_event_handler import QueueEventHandler

class Config:

    _instance = None

    def __call__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(Config).__call__(*args, **kwargs)
        return cls._instance
    
    def __init__(self):

        if hasattr(self, "_initialized") and self._initialized:
            return
        
        self.queueEventHandler = QueueEventHandler(self)
        
        self.pushConfig = {
            EventNameForPush.EMBEDDING_RESULT.value: EnvConfig.PYTHON_SERVICE_QUEUE,
            EventName.CHUNK.value: EnvConfig.NODE_SERVICE_QUEUE,
        }

        self.listenConfig = {
            EventName.CHUNK.value: self.queueEventHandler.handle_chunk,
        }

    def get_queue_name(self, event_name):
        return self.pushConfig.get(event_name)
    
    def get_handler(self, event_name):
        return self.listenConfig.get(event_name) 
