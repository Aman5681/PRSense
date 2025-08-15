import { SQS } from 'aws-sdk';
import { ChunkService } from './ChunkService';

export class QueueEventHandler {

  private static instance: QueueEventHandler;
  private chunkService: ChunkService;

  constructor() {
    this.chunkService = ChunkService.getInstance();
  }

  public static getInstance(): QueueEventHandler {
    if (!QueueEventHandler.instance) {
      QueueEventHandler.instance = new QueueEventHandler();
    }
    return QueueEventHandler.instance;
  }


  public async handleEmbeddingResult(msg: any) {
    console.log('[EmbeddingResultHandler] Handling EMBEDDING_RESULT:', msg);
    // store embeddings in DB or trigger further flow
  }

  public async startChunking(message: any) {
    await this.chunkService.startChunking(message);
  }

}