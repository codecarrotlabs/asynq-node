// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import crypto from "crypto";

// validates a given qname to be used as a queue name.
function validateQueueName(qname: string) {
  if (qname.trim().length === 0) {
    throw Error("queue name must contain one or more characters");
  }
}

function uniqueKey(qname: string, tasktype: string, payload?: Buffer): string {
  if (!payload) {
    return `${queueKeyPrefix(qname)}unique:${tasktype}:`;
  }

  const checksum = crypto.createHash("md5").update(payload).digest("hex");
  return `${queueKeyPrefix(qname)}unique:${tasktype}:${checksum}`;
}

// TaskKeyPrefix returns a prefix for task key.
function taskKeyPrefix(qname: string): string {
  return `${queueKeyPrefix(qname)}t:`;
}

// TaskKey returns a redis key for the given task message.
function taskKey(qname: string, id: string): string {
  return taskKeyPrefix(qname) + id;
}

// PendingKey returns a redis key for the given queue name.
function pendingKey(qname: string): string {
  return `${queueKeyPrefix(qname)}pending`;
}

export { uniqueKey, validateQueueName, taskKey, pendingKey };

// queueKeyPrefix returns a prefix for all keys in the given queue.
function queueKeyPrefix(qname: string): string {
  return `asynq:{${qname}}:`;
}
