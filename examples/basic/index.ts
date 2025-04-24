import { Task, AsynqClient, type TaskInfo } from "asynq-node";

const main = async () => {
  const client = new AsynqClient("redis://localhost:1000");

  const task = new Task("email:welcome", {
    userId: 123,
    name: "John Doe",
  });

  let taskInfo: TaskInfo;
  try {
    taskInfo = await client.enqueue(task);
  } catch (error) {
    taskInfo = null;
  }

  console.log("Task enqueued with ID:", taskInfo);
};

main().then(() => {
  process.exit(0);
})
