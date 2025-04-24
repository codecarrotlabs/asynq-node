# Example Basic

This is a basic example that demonstrates the working of [`asynq-node`](https://www.npmjs.com/package/asynq-node) package.

- `index.ts` - For enqueue task in Node.js
- `task.go` - For enqueue task in GoLang
- `worker.go` - For handling/processing the enqueued task using [Asynq](https://github.com/hibiken/asynq) in GoLang

### `index.ts`

This file enqueues a single task.

You can run this command in any runtime environment Bun, Node, Deno.

```bash
# bun
bun run ./index.ts
```

### `worker.go`

```bash
go run worker.go
```
