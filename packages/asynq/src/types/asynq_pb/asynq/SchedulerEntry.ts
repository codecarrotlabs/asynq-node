// Original file: proto/asynq.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';

export interface SchedulerEntry {
  'id'?: (string);
  'spec'?: (string);
  'task_type'?: (string);
  'task_payload'?: (Buffer | Uint8Array | string);
  'enqueue_options'?: (string)[];
  'next_enqueue_time'?: (_google_protobuf_Timestamp | null);
  'prev_enqueue_time'?: (_google_protobuf_Timestamp | null);
}

export interface SchedulerEntry__Output {
  'id': (string);
  'spec': (string);
  'task_type': (string);
  'task_payload': (Buffer);
  'enqueue_options': (string)[];
  'next_enqueue_time': (_google_protobuf_Timestamp__Output | null);
  'prev_enqueue_time': (_google_protobuf_Timestamp__Output | null);
}
