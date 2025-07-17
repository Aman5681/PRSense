import { QueueEventHandler } from "../services/QueueEventHandler";
import { EventName, EventNameForPush } from "../constants/EventNames";

const queueEventHandler = QueueEventHandler.getInstance();

export interface IQueueConfig {
  instance: any;
  queueName: string;
  callback: any;
}

export const queueHandlers: Record<EventName, { instance: any; queueName: string; callback: (instance: any) => (msg: AWS.SQS.Message) => Promise<void> }> = {
  [EventName.EMBEDDING_RESULT]: {
    instance: queueEventHandler,
    queueName: process.env.EMBEDDING_RESULT_QUEUE_URL,
    callback: (i) => i.handleEmbeddingResult,
  },
  [EventName.CHUNK]: {
    instance: queueEventHandler,
    queueName: process.env.CHUNK_QUEUE_URL,
    callback: (i) => i.handleEmbeddingResult,
  }
};

export const queuePushConfig: Record<EventNameForPush, string> = {
  [EventNameForPush.CHUNK]: 'SERVICE_QUEUE_URL',
  [EventNameForPush.ANALYZE_PR]: 'SERVICE_QUEUE_URL'
};