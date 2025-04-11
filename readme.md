# Asynq Node

> [Asynq](https://github.com/hibiken/asynq) is a Go library for queueing tasks and processing them asynchronously with workers. It's backed by Redis and is designed to be scalable yet easy to get started.
>
> Highlevel overview of how Asynq works:
> 
> * Client puts tasks on a queue
> * Server pulls tasks off queues and starts a worker goroutine for each task
> * Tasks are processed concurrently by multiple workers
>
> Task queues are used as a mechanism to distribute work across multiple machines. A system can consist of multiple worker servers and brokers, giving way to high availability and horizontal scaling.

This package allows you to queue tasks using Node.js and let your GoLang Asynq workers handle the rest.

## Feature parity

- [x] Equeue tasks
- [ ] Schedule tasks
- [ ] Group tasks
