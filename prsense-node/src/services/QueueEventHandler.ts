import { SQS } from 'aws-sdk';

export class QueueEventHandler {

  private static instance: QueueEventHandler;

  public static getInstance(): QueueEventHandler {
    if (!QueueEventHandler.instance) {
      QueueEventHandler.instance = new QueueEventHandler();
    }
    return QueueEventHandler.instance;
  }
  async handleEmbeddingResult(msg: SQS.Message) {
    const body = JSON.parse(msg.Body || '{}');
    console.log('[EmbeddingResultHandler] Handling EMBEDDING_RESULT:', body);
    // store embeddings in DB or trigger further flow
  }
}