import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Redis from "ioredis";
import { AsynqClient, Task, type TaskInfo } from "../src";
import { defaultQueueName } from "../src/helpers/constants";

describe("AsynqClient", () => {
  let client: AsynqClient;
  let redis: Redis;
  const redisUrl = process.env.DB_URL as string;

  beforeAll(() => {
    redis = new Redis(redisUrl);
    client = new AsynqClient(redisUrl);
  });

  afterAll(async () => {
    // await client.disconnect();
    await redis.quit();
  });

  it("should enqueue a task to the default queue", async () => {
    const task = new Task("email:welcome", { userId: 123, name: "John Doe" });

    let taskInfo: TaskInfo;
    try {
      taskInfo = await client.enqueue(task);

    } catch (e) {
      console.log('error enqueue task');
      console.log(e);
    }
    console.log('id:', taskInfo?.id);

    expect(taskInfo).toBeDefined();
    expect(taskInfo?.queue).toBe(defaultQueueName);

    const pendingKey = `asynq:{${defaultQueueName}}:pending`;
    const tasks = await redis.lrange(pendingKey, 0, -1);
    expect(tasks.length).toBe(1);
  });

  it.skip("should enqueue a task with a custom queue", async () => {
    const customQueue = "custom-queue";
    const task = new Task("email:reminder", { userId: 456 });

    const taskInfo = await client.enqueue(task, { queue: customQueue });

    expect(taskInfo).toBeDefined();
    expect(taskInfo.queue).toBe(customQueue);

    const pendingKey = `asynq:{${customQueue}}:pending`;
    const tasks = await redis.lrange(pendingKey, 0, -1);
    expect(tasks.length).toBe(1);
  });

  it.skip("should schedule a task for future processing", async () => {
    const task = new Task("email:scheduled", { userId: 789 });
    const processAt = new Date(Date.now() + 60 * 1000); // 1 minute in the future

    const taskInfo = await client.enqueue(task, { processAt });

    expect(taskInfo).toBeDefined();
    expect(taskInfo.state).toBe("scheduled");

    const scheduledKey = `asynq:{${defaultQueueName}}:scheduled`;
    const tasks = await redis.zrange(scheduledKey, 0, -1);
    expect(tasks.length).toBe(1);
  });

  it("should throw an error for an invalid task type", async () => {
    const task = new Task("", { userId: 123 });

    await expect(client.enqueue(task)).rejects.toThrow(
      "task typename cannot be empty"
    );
  });
});
