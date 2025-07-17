import { Config } from "../config";
import { EventNameForPush } from "../constants/EventNames";
import { IPayloadForPush } from "../constants/Interfaces";
import { Utils } from "../utils/Utils";
import AWS from 'aws-sdk';
import { QueueHandlerRegistry } from "./queue.config";



export class QueueManager {

  private static instance: QueueManager;
  private static handlers: Map<string, (msg: AWS.SQS.Message) => Promise<void>> = new Map();
  private sqs: AWS.SQS;
  private registry: QueueHandlerRegistry;

  constructor() {
    this.sqs = new AWS.SQS({
      region: Config.AWS_REGION,
    });
    this.registry = QueueHandlerRegistry.getInstance();

  }

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  public async init() {
    await this.startPollingOfHandlers();
  }

  private async startPollingOfHandlers() {
    const queueUrls = new Set<string>();
    const queueHandlers = this.registry.getHandlers();
    for (const [event, config] of Object.entries(queueHandlers)) {
      QueueManager.handlers.set(event, config.callback(config.instance));
      const queueUrl = await this._getQueueUrl(config.queueName);
      queueUrls.add(queueUrl);
    }

    for (const queueUrl of queueUrls) {
      await this.poll(queueUrl); // only once per queue
    }
  }

  public async pushMessageToQueue(event: EventNameForPush, payload: IPayloadForPush, isFifo = false) {
    // queue url will be taken based on the event name

    const body = JSON.stringify({ event, ...payload });
    const queueName = this.registry.getPushQueue(event);
    const url = await this._getQueueUrl(queueName);

    const params: AWS.SQS.SendMessageRequest = {
      QueueUrl: url,
      MessageBody: body,
    };

    if (isFifo) {
      params.MessageGroupId = payload.groupId || 'defaultGroup';
      params.MessageDeduplicationId = payload.deduplicationId || Utils.getUuid();
    }

    try {
      const result = await this.sqs.sendMessage(params).promise();
      console.log(`[QueueManager] Message sent to ${url}: ${result.MessageId}`);
    } catch (err) {
      console.error('[QueueManager] Error sending message:', err);
    }
  }

  public async poll(queueUrl: string): Promise<void> {
    console.log(`[QueueManager] Started polling queue: ${queueUrl}`);

    const pollLoop = async () => {
      try {
        const data = await this.sqs.receiveMessage({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 10,
          VisibilityTimeout: 30,
        }).promise();

        if (data.Messages && data.Messages.length > 0) {
          for (const message of data.Messages) {
            try {

              const parsed = JSON.parse(message.Body || '{}');
              const event = parsed.event;
              const handler = QueueManager.handlers.get(event);

              if (handler) {
                await handler(message);
                await this._delete(queueUrl, message.ReceiptHandle!);
              }
              else {
                console.warn(`[QueueManager] No handler found for event: ${event}`);
              }
            } catch (e) {
              console.error('[QueueManager] Failed to process message:', e);
            }
          }
        }
      } catch (err) {
        console.error('[QueueManager] Error polling SQS:', err);
      }

      setTimeout(pollLoop, 100); // or 100 for very slight delay
    };

    pollLoop();
  }

  private async _delete(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      await this.sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      }).promise();
    } catch (err) {
      console.error('[QueueManager] Error deleting message:', err);
    }
  }

  private async _getQueueUrl(queueName: string): Promise<string> {
    try {
      const result = await this.sqs.getQueueUrl({ QueueName: queueName }).promise();
      return result.QueueUrl!;
    } catch (error) {
      console.error(`[QueueManager] Failed to get URL for queue "${queueName}":`, error);
      throw error;
    }
  }

}