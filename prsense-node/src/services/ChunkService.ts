export class ChunkService {

  private static instance: ChunkService;

  public static getInstance(): ChunkService {
    if (!ChunkService.instance) {
      ChunkService.instance = new ChunkService();
    }
    return ChunkService.instance;
  }

  public async startChunking(payload) {
    console.log(payload);
  }
}