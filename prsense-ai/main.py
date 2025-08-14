from config import Config
from constants.event_name import EventName, EventNameForPush
from queues.queue_manager import QueueManager
from queues.queue_handler_registry import QueueHandlerRegistry
from services.queue_event_handler import QueueEventHandler
import asyncio

async def main():
    # Initialize handler and registry
    event_handler = QueueEventHandler()
    registry = QueueHandlerRegistry(event_handler)
    queue_manager = QueueManager(registry)
    event_handler.queue_manager = queue_manager  # <-- Wire up for event chaining

    # Push a test message
    test_payload = {
        "chunkId": "abc123",
        "content": "This is a test chunk."
    }
    await queue_manager.push_message_to_queue(EventNameForPush.CHUNK.value, test_payload)
    print("[Main] Test chunk message sent.")

    # Start polling (consumer)
    await queue_manager.init()

if __name__ == '__main__':
    asyncio.run(main())
