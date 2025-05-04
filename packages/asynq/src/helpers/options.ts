// Default queue name used if none are specified by user.
export const defaultQueueName = "default";

// Default max retry count used if nothing is specified.
export const defaultMaxRetry = 25;

// Default timeout used if both timeout and deadline are not specified (in milliseconds)
export const defaultTimeoutInMS = 1000 * 60 * 30;

// Value zero indicates no timeout and no deadline.
export const noTimeout = 0;
export const noDeadline = 0;
