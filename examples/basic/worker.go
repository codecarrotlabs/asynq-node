package main

import (
	"context"
	"fmt"
	"github.com/hibiken/asynq"
	"log"
)

// A list of task types (optional)
const (
	TypeEmailDelivery = "email:welcome"
	TypeImageResize   = "image:resize"
)

const redisAddr = "localhost:6379"

func main() {
	srv := asynq.NewServer(asynq.RedisClientOpt{Addr: redisAddr}, asynq.Config{})

	// mux maps a type to a handler
	mux := asynq.NewServeMux()
	mux.HandleFunc(TypeEmailDelivery, HandleEmailDeliveryTask)
	//mux.Handle(tasks.TypeImageResize, tasks.NewImageProcessor())
	// ...register other handlers...

	if err := srv.Run(mux); err != nil {
		log.Fatalf("could not run server: %v", err)
	}
}

func HandleEmailDeliveryTask(ctx context.Context, t *asynq.Task) error {
	log.Printf("Handle Email Delivery")
	log.Printf("task: %s", t)
	log.Printf("payload: %s", t.Payload())

	return nil
}
