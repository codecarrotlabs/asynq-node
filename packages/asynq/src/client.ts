import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { type Task, TaskState } from "./task";
import type { EnqueueOptions, TaskMessage } from "./types/types";
import * as base from "./helpers/base";
import { TaskInfo } from "./taskInfo";
import { Broker } from "./broker";
import {
  defaultMaxRetry,
  defaultQueueName,
  defaultTimeoutInMS,
  noDeadline,
  noTimeout,
} from "./helpers/options";

export class AsynqClient {
  private broker: Broker;

  constructor(redisUrl: string) {
    const redis = new Redis(redisUrl);
    this.broker = new Broker(redis);
  }

  // Enqueue adds the given task to the pending list of the queue.
  async enqueue(
    task: Task,
    options?: Partial<EnqueueOptions>,
  ): Promise<TaskInfo> {
    if (task.typeName.trim().length === 0) {
      throw new Error("task typename cannot be empty");
    }

    // TODO: merge task options with the options provided at enqueue time.
    const opts = this.composeOptions(task.opts, options);

    let deadline = noDeadline;
    if (options?.deadline !== 0) {
      deadline = opts.deadline;
    }

    let timeout = noTimeout;
    if (options?.timeout !== 0) {
      timeout = opts.timeout;
    }

    if (deadline === noDeadline && timeout === noTimeout) {
      // If neither deadline nor timeout are set, use default timeout.
      timeout = defaultTimeoutInMS;
    }

    let uniqueKey = "";
    if (opts?.uniqueTTL && opts.uniqueTTL > 0) {
      uniqueKey = base.uniqueKey(opts.queue, task.type, task.payload);
    }

    const msg: TaskMessage = {
      id: opts.taskID,
      type: task.type,
      payload: task.payload,
      queue: opts.queue,
      retry: opts.retry,
      deadline: opts.deadline,
      timeout: opts.timeout,
      uniqueKey: uniqueKey,
      groupKey: opts.group || "",
      retention: opts.retention,
      // default values
      retried: 0,
      errorMsg: "",
      lastFailedAt: 0,
      completedAt: 0,
    };

    const now = new Date();
    let state: TaskState;

    if (opts?.processAt && opts.processAt > now) {
      // schedule task
      state = TaskState.scheduled;
      // } else if (opts.group !== "") {
      //   // TODO: handle group logic
      //   // Use zero value for processAt since we don't know when the task will be aggregated and processed.
      //   state = TaskState.aggregating;
    } else {
      opts.processAt = now;
      await this._enqueue(msg, opts.uniqueTTL);
      state = TaskState.pending;
    }

    return new TaskInfo(msg, state, opts.processAt);
  }

  private async _enqueue(msg: TaskMessage, uniqueTTL: number) {
    await this.broker.enqueue(msg);
  }

  private composeOptions(
    taskOpts?: Partial<EnqueueOptions>,
    enqueueOpts?: Partial<EnqueueOptions>,
  ) {
    const res: EnqueueOptions = {
      retry: defaultMaxRetry,
      queue: defaultQueueName,
      taskID: uuidv4(),
      // do not set to defaultTimeout here
      timeout: 0,
      deadline: 0,
      processAt: new Date(),
      uniqueTTL: 0,
      retention: 0,
    };

    function processOptions(opts?: Partial<EnqueueOptions>) {
      if (!opts) return;

      // Retry
      if (opts?.retry) {
        res.retry = opts.retry;
      }

      // Queue
      if (opts?.group) {
        const qname = opts.queue || "";
        base.validateQueueName(qname);
        res.queue = qname;
      }

      // task id
      if (opts?.taskID) {
        if (opts.taskID.trim().length === 0) {
          throw new Error("task ID cannot be empty");
        }

        res.taskID = opts.taskID.trim();
      }

      // timeout
      if (opts?.timeout) {
        res.timeout = opts.timeout;
      }

      // deadline
      if (opts?.deadline) {
        res.deadline = opts.deadline;
      }

      // unique TTL
      if (opts?.uniqueTTL) {
        if (opts.uniqueTTL < 1) {
          throw new Error("Unique TTL cannot be less than 1s");
        }
        res.uniqueTTL = opts.uniqueTTL;
      }

      // group
      if (opts?.group) {
        if (opts.group.trim().length === 0) {
          throw new Error("group key cannot be empty");
        }
        res.group = opts.group.trim();
      }

      // retention
      if (opts?.retention) {
        res.retention = opts.retention;
      }
    }

    processOptions(enqueueOpts);
    processOptions(taskOpts);

    return res;
  }
}
