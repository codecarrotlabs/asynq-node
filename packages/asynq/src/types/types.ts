export type TaskMessage = {
  // Type indicates the kind of the task to be performed.
  type: string;

  // Payload holds data needed to process the task.
  payload: Buffer;

  // ID is a unique identifier for each task.
  id: string;

  // Queue is a name this message should be enqueued to.
  queue: string;

  // Retry is the max number of retry for this task.
  retry: number;

  // Retried is the number of times we've retried this task so far.
  retried: number;

  // ErrorMsg holds the error message from the last failure.
  errorMsg: string;

  // Time of last failure in Unix time,
  // the number of seconds elapsed since January 1, 1970 UTC.
  //
  // Use zero to indicate no last failure
  lastFailedAt: number;

  // Timeout specifies timeout in seconds.
  // If task processing doesn't complete within the timeout, the task will be retried
  // if retry count is remaining. Otherwise it will be moved to the archive.
  //
  // Use zero to indicate no timeout.
  timeout: number;

  // Deadline specifies the deadline for the task in Unix time,
  // the number of seconds elapsed since January 1, 1970 UTC.
  // If task processing doesn't complete before the deadline, the task will be retried
  // if retry count is remaining. Otherwise it will be moved to the archive.
  //
  // Use zero to indicate no deadline.
  deadline: number;

  // UniqueKey holds the redis key used for uniqueness lock for this task.
  //
  // Empty string indicates that no uniqueness lock was used.
  uniqueKey: string;

  // GroupKey holds the group key used for task aggregation.
  //
  // Empty string indicates no aggregation is used for this task.
  groupKey: string;

  // Retention specifies the number of seconds the task should be retained after completion.
  retention: number;

  // CompletedAt is the time the task was processed successfully in Unix time,
  // the number of seconds elapsed since January 1, 1970 UTC.
  //
  // Use zero to indicate no value.
  completedAt: number;
};

export type EnqueueOptions = {
  queue: string;
  retry: number;
  taskID: string;
  // NOTE: Go type `time.Duration`
  timeout: number;
  // NOTE: Go type `time.Time`
  deadline: number;
  uniqueTTL: number;
  processAt: Date;
  group?: string;
  retention: number;
};
