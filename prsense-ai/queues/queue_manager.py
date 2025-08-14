import boto3
import json
import asyncio
from config import Config
from queues.queue_push_config import PushConfig

class QueueManager:
    def __init__(self, registry):
        self.sqs = boto3.client(
            'sqs',
            region_name=Config.AWS_REGION,
            aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY
        )
        self.push_config = PushConfig()
        self.registry = registry
        self.polling = False

    async def init(self):
        # Start polling for all queues in config
        queue_names = set(self.push_config.config.values())
        await asyncio.gather(*(self.poll(queue_name) for queue_name in queue_names))

    async def push_message_to_queue(self, event, payload):
        queue_name = self.push_config.get_queue_name(event)
        if not queue_name:
            raise ValueError(f"No queue mapped for event {event}")
        queue_url = self.sqs.get_queue_url(QueueName=queue_name)['QueueUrl']
        message = {
            'event': event,
            **payload
        }
        response = self.sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps(message)
        )
        print(f"[QueueManager] Message sent: {response['MessageId']}")

    async def poll(self, queue_name):
        queue_url = self.sqs.get_queue_url(QueueName=queue_name)['QueueUrl']
        print(f"[QueueManager] Started polling queue: {queue_url}")
        while True:
            data = self.sqs.receive_message(
                QueueUrl=queue_url,
                MaxNumberOfMessages=10,
                WaitTimeSeconds=10,
                VisibilityTimeout=30
            )
            messages = data.get('Messages', [])
            for message in messages:
                try:
                    body = json.loads(message['Body'])
                    event = body.get('event')
                    handler = self.registry.get_handler(event)
                    if handler:
                        await handler(body)
                        self.sqs.delete_message(
                            QueueUrl=queue_url,
                            ReceiptHandle=message['ReceiptHandle']
                        )
                    else:
                        print(f"[QueueManager] No handler found for event: {event}")
                except Exception as e:
                    print(f"[QueueManager] Failed to process message: {e}")
            await asyncio.sleep(1) 