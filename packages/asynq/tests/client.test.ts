import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Redis from "ioredis";
import { AsynqClient } from "../src/client";

describe("AsynqClient", () => {
  let client: AsynqClient;
  let redis: Redis.Redis;
  let dbUrl = process.env.DB_URL as string;

  beforeAll(() => {
    redis = new Redis(dbUrl);
    client = new AsynqClient(dbUrl);
  });

  afterAll(async () => {
    await client.disconnect();
    await redis.quit();
  });

  it("should enqueue a task successfully", async () => {
    const taskType = "email:welcome";
    const payload = { userId: 123, name: "John Doe" };
    const options = { processAt: new Date(Date.now() + 10_000) };

    const taskId = await client.enqueue(taskType, payload, options);

    expect(taskId).toBeDefined();

    const zsetKey = `asynq:{default}:scheduled`;
    const tasks = await redis.zrange(zsetKey, 0, -1);
    expect(tasks.length).toBe(1);
  });

  it("should enqueue a task to the default queue if no queue is specified", async () => {
    const taskType = "email:reminder";
    const payload = { userId: 456 };

    const taskId = await client.enqueue(taskType, payload);

    expect(taskId).toBeDefined();

    const zsetKey = `asynq:{default}:pending`;
    const tasks = await redis.zrange(zsetKey, 0, -1);
    expect(tasks.length).toBe(1);
  });
});
