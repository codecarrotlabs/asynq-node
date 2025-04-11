// Original file: proto/asynq.proto

import type {
  Timestamp as _google_protobuf_Timestamp,
  Timestamp__Output as _google_protobuf_Timestamp__Output,
} from "../google/protobuf/Timestamp";

export interface ServerInfo {
  host?: string;
  pid?: number;
  server_id?: string;
  concurrency?: number;
  queues?: { [key: string]: number };
  strict_priority?: boolean;
  status?: string;
  start_time?: _google_protobuf_Timestamp | null;
  active_worker_count?: number;
}

export interface ServerInfo__Output {
  host: string;
  pid: number;
  server_id: string;
  concurrency: number;
  queues: { [key: string]: number };
  strict_priority: boolean;
  status: string;
  start_time: _google_protobuf_Timestamp__Output | null;
  active_worker_count: number;
}
