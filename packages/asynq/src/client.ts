import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import {encodeMessage} from "./helpers";

type Payload = Record<string, any>;

export class AsynqClient {
  private redis: Redis.Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  // Enqueue adds the given task to the pending list of the queue.
  async enqueue(taskType: string, payload: Payload, options?: {
    queue?: string;
    retry?: number;
    timeout?: number;
    deadline?: Date;
    processAt?: Date;
    uniqueKey?: string;
    retention?: number;
  }): Promise<string> {
    const id = uuidv4();
    const queue = options?.queue ?? 'default';

    const taskPayload = Buffer.from(JSON.stringify(payload));

    const encoded = encodeMessage({
      id,
      type: taskType,
      payload: taskPayload,
      queue,
      retry: options?.retry ?? 25,
      timeout: options?.timeout ?? 180,
      deadline: options?.deadline ? Math.floor(options.deadline.getTime() / 1000) : 0,
      process_at: options?.processAt ? Math.floor(options.processAt.getTime() / 1000) : 0,
      unique_key: options?.uniqueKey ?? '',
      retention: options?.retention ?? 3600,
    });

    const zsetKey = this.getZSetKey(queue, options?.processAt);

    const score = options?.processAt
        ? Math.floor(options.processAt.getTime() / 1000)
        : Math.floor(Date.now() / 1000);

    await this.redis.zadd(zsetKey, `${score}`, encoded);

    return id;
  }

  private getZSetKey(queue: string, schedule?: Date): string {
    if (schedule && schedule.getTime() > Date.now()) {
      return `asynq:{${queue}}:scheduled`;
    }
    return `asynq:{${queue}}:pending`;
  }

  async disconnect() {
    await this.redis.quit();
  }
}
