import type { TaskMessage } from "./types/types";
import { TaskState } from "./task";

export class TaskInfo {
  // ID is the identifier of the task.
  id: string;

  // Queue is the name of the queue in which the task belongs.
  queue: string;

  // Type is the type name of the task.
  type: string;

  // Payload is the payload data of the task.
  payload: Buffer;

  // State indicates the task state.
  state: TaskState;

  // MaxRetry is the maximum number of times the task can be retried.
  maxRetry: number;

  // Retried is the number of times the task has retried so far.
  retried: number;

  // LastErr is the error message from the last failure.
  lastErr: string;

  // LastFailedAt is the time time of the last failure if any.
  // If the task has no failures, LastFailedAt is zero time (i.e. time.Time{}).
  lastFailedAt: number;

  // Timeout is the duration the task can be processed by Handler before being retried,
  // zero if not specified
  timeout: number;

  // Deadline is the deadline for the task, zero value if not specified.
  deadline: number;

  // Group is the name of the group in which the task belongs.
  //
  // Tasks in the same queue can be grouped together by Group name and will be aggregated into one task
  // by a Server processing the queue.
  //
  // Empty string (default) indicates task does not belong to any groups, and no aggregation will be applied to the task.
  group: string;

  // NextProcessAt is the time the task is scheduled to be processed,
  // zero if not applicable.
  nextProcessAt: Date;

  // IsOrphaned describes whether the task is left in active state with no worker processing it.
  // An orphaned task indicates that the worker has crashed or experienced network failures and was not able to
  // extend its lease on the task.
  //
  // This task will be recovered by running a server against the queue the task is in.
  // This field is only applicable to tasks with TaskStateActive.
  isOrphaned = false;

  // Retention is duration of the retention period after the task is successfully processed.
  retention: number;

  // CompletedAt is the time when the task is processed successfully.
  // Zero value (i.e. time.Time{}) indicates no value.
  completedAt: number;

  // Result holds the result data associated with the task.
  // Use ResultWriter to write result data from the Handler.
  result?: Buffer;

  constructor(
    msg: TaskMessage,
    state: TaskState,
    nextProcessAt: Date,
    result?: Buffer,
  ) {
    this.id = msg.id;
    this.queue = msg.queue;
    this.type = msg.type;
    this.payload = msg.payload;
    this.state = state;
    this.maxRetry = msg.retry;
    this.retried = msg.retried;
    this.timeout = msg.timeout;
    this.deadline = msg.deadline;
    this.lastErr = msg.errorMsg;
    this.lastFailedAt = msg.lastFailedAt;
    this.group = msg.groupKey;
    this.nextProcessAt = nextProcessAt;
    this.retention = msg.retention;
    this.completedAt = msg.completedAt;
    this.result = result;

    switch (state) {
      case TaskState.active:
        this.state = TaskState.active;
        break;
      case TaskState.pending:
        this.state = TaskState.pending;
        break;
      case TaskState.scheduled:
        this.state = TaskState.scheduled;
        break;
      case TaskState.retry:
        this.state = TaskState.retry;
        break;
      case TaskState.archived:
        this.state = TaskState.archived;
        break;
      case TaskState.completed:
        this.state = TaskState.completed;
        break;
      case TaskState.aggregating:
        this.state = TaskState.aggregating;
        break;
      default:
        throw new Error(`internal error: unknown state: ${state}`);
    }
  }
}
