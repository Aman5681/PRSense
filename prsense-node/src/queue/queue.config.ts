// src/queue/QueueHandlerRegistry.ts

import { QueueEventHandler } from "../services/QueueEventHandler";
import { EventName, EventNameForPush } from "../constants/EventNames";
import { Config } from "../config";
import AWS from 'aws-sdk';

type QueueHandler = {
  instance: any;
  queueName: string;
  callback: (instance: any) => (msg: AWS.SQS.Message) => Promise<void>;
};

export class QueueHandlerRegistry {
  private static _instance: QueueHandlerRegistry;
  private queueEventHandler = QueueEventHandler.getInstance();

  private handlers: Record<EventName, QueueHandler> = {
    [EventName.EMBEDDING_RESULT]: {
      instance: this.queueEventHandler,
      queueName: Config.NODEJS_SERVICE_QUEUE,
      callback: (i) => i.handleEmbeddingResult,
    },
    // [EventName.CHUNK]: {
    //   instance: this.queueEventHandler,
    //   queueName: Config.NODEJS_SERVICE_QUEUE,
    //   callback: (i) => i.handleEmbeddingResult,
    // }
  };

  private pushConfig: Record<EventNameForPush, string> = {
    [EventNameForPush.CHUNK]: Config.NODEJS_SERVICE_QUEUE,
    [EventNameForPush.ANALYZE_PR]: Config.NODEJS_SERVICE_QUEUE,
  };

  static getInstance(): QueueHandlerRegistry {
    if (!this._instance) {
      this._instance = new QueueHandlerRegistry();
    }
    return this._instance;
  }

  getHandlers(): Record<EventName, QueueHandler> {
    return this.handlers;
  }

  getPushQueue(event: EventNameForPush): string {
    return this.pushConfig[event];
  }
}
