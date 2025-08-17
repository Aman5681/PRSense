import { EventNameForPush } from "./EventNames";


export type EventPayloadMap = {
  [EventNameForPush.START_CHUNKING]: { repoName: string },
  [EventNameForPush.CHUNK]: {
    chunk: string; // temp
    fileName: string;
    fileExtension: string;
    relativePath: string;
    groupId?: string;
    deduplicationId?: string;
  }
  [EventNameForPush.ANALYZE_PR]: { analyse: true }
}