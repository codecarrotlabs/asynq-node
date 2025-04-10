export type Message = {
  // Type indicates the kind of the task to be performed.
  Type: string

  // Payload holds data needed to process the task.
  // Payload []byte

  // ID is a unique identifier for each task.
  ID: string

  // Queue is a name this message should be enqueued to.
  Queue: string

  // Retry is the max number of retry for this task.
  Retry: number

  // Retried is the number of times we've retried this task so far.
  Retried: number

  // ErrorMsg holds the error message from the last failure.
  ErrorMsg: string

  // Time of last failure in Unix time,
  // the number of seconds elapsed since January 1, 1970 UTC.
  //
  // Use zero to indicate no last failure
  LastFailedAt: number

  // Timeout specifies timeout in seconds.
  // If task processing doesn't complete within the timeout, the task will be retried
  // if retry count is remaining. Otherwise it will be moved to the archive.
  //
  // Use zero to indicate no timeout.
  Timeout: number

  // Deadline specifies the deadline for the task in Unix time,
  // the number of seconds elapsed since January 1, 1970 UTC.
  // If task processing doesn't complete before the deadline, the task will be retried
  // if retry count is remaining. Otherwise it will be moved to the archive.
  //
  // Use zero to indicate no deadline.
  Deadline: number

  // UniqueKey holds the redis key used for uniqueness lock for this task.
  //
  // Empty string indicates that no uniqueness lock was used.
  UniqueKey: string

  // GroupKey holds the group key used for task aggregation.
  //
  // Empty string indicates no aggregation is used for this task.
  GroupKey: string

  // Retention specifies the number of seconds the task should be retained after completion.
  Retention: number

  // CompletedAt is the time the task was processed successfully in Unix time,
  // the number of seconds elapsed since January 1, 1970 UTC.
  //
  // Use zero to indicate no value.
  CompletedAt: number
}
