import type Redis from "ioredis";

import { encodeMessage } from "./helpers";
import type { TaskMessage } from "./types/types";
import { AllQueues } from "./helpers/constants";
import { pendingKey, taskKey } from "./helpers/base";

// enqueueCmd enqueues a given task message.
//
// Input:
// KEYS[1] -> asynq:{<qname>}:t:<task_id>
// KEYS[2] -> asynq:{<qname>}:pending
// --
// ARGV[1] -> task message data
// ARGV[2] -> task ID
// ARGV[3] -> current unix time in nsec
//
// Output:
// Returns 1 if successfully enqueued
// Returns 0 if task ID already exists
const enqueueCmd = `
if redis.call("EXISTS", KEYS[1]) == 1 then
	return 0
end
redis.call("HSET", KEYS[1],
           "msg", ARGV[1],
           "state", "pending",
           "pending_since", ARGV[3])
redis.call("LPUSH", KEYS[2], ARGV[2])
return 1
`;

export class Broker {
  private client: Redis;
  private clock: Date;
  private queuesPublished: Map<string, boolean>;

  constructor(client: Redis) {
    this.client = client;
    this.clock = new Date();
    this.queuesPublished = new Map();
  }

  // Enqueue adds the given task to the pending list of the queue.
  async enqueue(msg: TaskMessage) {
    const op = "rdb.enqueue";

    let encoded: Uint8Array;
    try {
      encoded = await encodeMessage(msg);
    } catch (err) {
      throw new Error(`${op} cannot encode message: ${(err as Error).message}`);
    }

    if (!this.queuesPublished.has(msg.queue)) {
      try {
        await this.client.sadd(AllQueues, msg.queue);
      } catch (err) {
        throw new Error(`${op} 'sadd' ${(err as Error).message}`);
      }

      this.queuesPublished.set(msg.queue, true);
    }

    const keys = [taskKey(msg.queue, msg.id), pendingKey(msg.queue)];

    const argv = [
      encoded,
      msg.id,
      // convert to nanoseconds
      this.clock.getTime() * 1000000,
    ];

    const n = await this.runScriptWithErrorCode(op, enqueueCmd, keys, argv);
    if (n === 0) {
      throw new Error(`${op} "Task ID conflict"`);
    }
  }

  private async runScriptWithErrorCode(
    op: string,
    script: string,
    keys: string[],
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    args: any[],
  ): Promise<number> {
    try {
      // Assuming scriptName corresponds to a loaded Lua script's SHA or name
      // and you’re using `evalsha` or `eval`
      const result = await this.client.eval(
        script,
        keys.length,
        ...keys,
        ...args,
      );
      return result as number;
    } catch (err) {
      throw new Error(`${op}, ${script}, ${(err as Error).message}`);
    }
  }
}
