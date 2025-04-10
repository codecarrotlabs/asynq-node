// Original file: proto/asynq.proto

import type { Long } from '@grpc/proto-loader';

export interface TaskMessage {
  'type'?: (string);
  'payload'?: (Buffer | Uint8Array | string);
  'id'?: (string);
  'queue'?: (string);
  'retry'?: (number);
  'retried'?: (number);
  'error_msg'?: (string);
  'timeout'?: (number | string | Long);
  'deadline'?: (number | string | Long);
  'unique_key'?: (string);
  'last_failed_at'?: (number | string | Long);
  'retention'?: (number | string | Long);
  'completed_at'?: (number | string | Long);
  'group_key'?: (string);
}

export interface TaskMessage__Output {
  'type': (string);
  'payload': (Buffer);
  'id': (string);
  'queue': (string);
  'retry': (number);
  'retried': (number);
  'error_msg': (string);
  'timeout': (string);
  'deadline': (string);
  'unique_key': (string);
  'last_failed_at': (string);
  'retention': (string);
  'completed_at': (string);
  'group_key': (string);
}
