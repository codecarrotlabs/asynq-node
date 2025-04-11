import { Task, AsynqClient } from "asynq-node";

const main = async () => {
  const client = new AsynqClient("redis://localhost:6379");

  const task = new Task("email:welcome", {
    userId: 123,
    name: "John Doe",
  });

  const taskId = await client.enqueue(task);

  console.log("Task enqueued with ID:", taskId);
};

main();
