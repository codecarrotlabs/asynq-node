// Original file: proto/asynq.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';

export interface SchedulerEnqueueEvent {
  'task_id'?: (string);
  'enqueue_time'?: (_google_protobuf_Timestamp | null);
}

export interface SchedulerEnqueueEvent__Output {
  'task_id': (string);
  'enqueue_time': (_google_protobuf_Timestamp__Output | null);
}
