import protobuf from "protobufjs";

// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";
import type { TaskMessage } from "../types/asynq_pb/asynq/TaskMessage";

const protoPath = path.resolve(__dirname, "../../proto/asynq.proto");

export async function encodeMessage(message: TaskMessage) {
  const asynqPb = await protobuf.load(protoPath);

  const taskMessageObject = asynqPb.lookupType("TaskMessage");

  const verifyPayload = taskMessageObject.verify(message);
  if (verifyPayload) {
    throw new Error(verifyPayload);
  }

  const buffer = taskMessageObject
    .encode(taskMessageObject.create(message))
    .finish();
  return buffer;
}
