// DefaultQueueName is the queue name used if none are specified by user.
export const defaultQueueName = "default";

export const AllServers = "asynq:servers"; // ZSET
export const AllWorkers = "asynq:workers"; // ZSET
export const AllSchedulers = "asynq:schedulers"; // ZSET
export const AllQueues = "asynq:queues"; // SET
export const CancelChannel = "asynq:cancel"; // PubSub channel
