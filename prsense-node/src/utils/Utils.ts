import { v4 as uuidv4 } from 'uuid';
import { QueueManager } from '../queue/QueueManager';
import { EventNameForPush } from '../constants/EventNames';
import { EventPayloadMap } from '../constants/Interfaces';

export class Utils {

  public static getUuid() {
    return uuidv4();
  }

  public static async pushMessageToQueue<T extends EventNameForPush>(event: T, payload: EventPayloadMap[T], isFifo = false) {
    const queueManager = QueueManager.getInstance();
    await queueManager.pushMessageToQueue(event, payload, isFifo);
  }
}