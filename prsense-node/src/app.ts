import './config';
import express from 'express';
import { QueueManager } from './queue/QueueManager';
import { EventNameForPush } from './constants/EventNames';
import { IPayloadForPush } from './constants/Interfaces';

async function init() {
  const queue = QueueManager.getInstance();
  await queue.init()

  // 3. Send Test CHUNK_FILE Event to Python via Queue
  const testPayload: IPayloadForPush = {
    chunk: 'test_chunk',
    fileName: "fileName",
    fileExtension: ".ts",
  };

  await queue.pushMessageToQueue(EventNameForPush.CHUNK, testPayload, false)
    .then(() => console.log('[App] Test CHUNK_FILE event pushed'))
    .catch((err) => console.error('[App] Failed to push test CHUNK_FILE event:', err));
}


// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

init()
