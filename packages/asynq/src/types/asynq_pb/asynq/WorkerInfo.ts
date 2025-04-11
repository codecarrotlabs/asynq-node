// Original file: proto/asynq.proto

import type {
  Timestamp as _google_protobuf_Timestamp,
  Timestamp__Output as _google_protobuf_Timestamp__Output,
} from "../google/protobuf/Timestamp";

export interface WorkerInfo {
  host?: string;
  pid?: number;
  server_id?: string;
  task_id?: string;
  task_type?: string;
  task_payload?: Buffer | Uint8Array | string;
  queue?: string;
  start_time?: _google_protobuf_Timestamp | null;
  deadline?: _google_protobuf_Timestamp | null;
}

export interface WorkerInfo__Output {
  host: string;
  pid: number;
  server_id: string;
  task_id: string;
  task_type: string;
  task_payload: Buffer;
  queue: string;
  start_time: _google_protobuf_Timestamp__Output | null;
  deadline: _google_protobuf_Timestamp__Output | null;
}
