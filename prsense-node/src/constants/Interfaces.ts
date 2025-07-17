export interface IPayloadForPush {
  // add payload here
  chunk: string; // temp
  fileName: string;
  fileExtension: string;
  groupId?: string;
  deduplicationId?: string;
}