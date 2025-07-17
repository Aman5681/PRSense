import dotenv from 'dotenv';
dotenv.config();

import { QueueManager } from './queue/QueueManager';
import { queueHandlers } from './queue/queue.config';
import { EventName, EventNameForPush } from './constants/EventNames';
import AWS from 'aws-sdk';
import { IPayloadForPush } from './constants/Interfaces';

const CHUNK_QUEUE_URL = process.env.CHUNK_QUEUE_URL!;
const EMBEDDING_RESULT_QUEUE_URL = process.env.EMBEDDING_RESULT_QUEUE_URL!;

const queue = QueueManager.getInstance();

queue.init()

// 3. Send Test CHUNK_FILE Event to Python via Queue
const testPayload: IPayloadForPush = {
  chunk: 'test_chunk',
  fileName: "fileName",
  fileExtension: ".ts",
};

queue.pushMessageToQueue(EventNameForPush.CHUNK, testPayload, false)
  .then(() => console.log('[App] Test CHUNK_FILE event pushed'))
  .catch((err) => console.error('[App] Failed to push test CHUNK_FILE event:', err));
