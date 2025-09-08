from queues.queue_manager import QueueManager
import asyncio

async def main():
    # Initialize handler and registry
    queue_manager = QueueManager()

    # Start polling (consumer)
    await queue_manager.init()

if __name__ == '__main__':
    asyncio.run(main())
