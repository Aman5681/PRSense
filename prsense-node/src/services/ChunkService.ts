import path from "path";
import fs from "fs";
import { EventNameForPush } from "../constants/EventNames";
import { encoding_for_model, Tiktoken } from "@dqbd/tiktoken";
import { Utils } from "../utils/Utils";

const allowedExts = ['.js', '.ts', '.py', '.java', '.go', '.c', '.cpp', '.cc', '.hpp'];

export class ChunkService {

  private static instance: ChunkService;

  private encoder: Tiktoken;

  constructor() {
    this.encoder = encoding_for_model("gpt-4"); // encoder instance

  }

  public static getInstance(): ChunkService {
    if (!ChunkService.instance) {
      this.instance = new ChunkService();
    }
    return this.instance;
  }

  public async startChunking(payload: { repoName: string }) {
    const repoPath = path.resolve('repos', payload.repoName);
    const files = this.getAllFiles(repoPath);

    const concurrency = 10;

    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);


      await Promise.all(
        batch.map(async (file) => {
          const fileExtension = file.fileName.split(".")[1];
          const relativePath = file.filePath.split("repos/")[1];
          const content = fs.readFileSync(file.filePath, "utf8");
          const chunks = this.chunkByTokens(content, 400);

          for (const chunk of chunks) {
            await Utils.pushMessageToQueue(EventNameForPush.CHUNK, { chunk, fileName: file.fileName, fileExtension, relativePath });
          }
        })
      )
    }

  }

  private getAllFiles(dir: string, allFiles: { fileName: string, filePath: string }[] = []): Array<{ fileName: string, filePath: string }> {
    const entries = fs.readdirSync(dir, { withFileTypes: true, recursive: true });
    for (const entry of entries) {
      const fullPath = path.join(entry.path, entry.name);
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExts.includes(ext)) allFiles.push({ fileName: entry.name, filePath: fullPath });
    }
    return allFiles
  }

  private chunkByTokens(text: string, maxTokens: number, overlap: number = 30): string[] {
    const tokens = this.encoder.encode(text);
    const chunks: string[] = [];

    for (let i = 0; i < tokens.length; i += maxTokens - overlap) {
      const slice = tokens.slice(i, i + maxTokens);
      const chunk = this.encoder.decode(slice);
      const decoder = new TextDecoder('utf-8');
      const str = decoder.decode(chunk);
      chunks.push(str);
    }

    if (chunks.length > 1) {
      const lastChunk = chunks[chunks.length - 1];
      const lineCount = lastChunk.split("\n").length;

      if (lineCount < 50) {
        chunks[chunks.length - 2] += "\n" + lastChunk;
        chunks.pop();
      }
    }
    return chunks;
  }
}
