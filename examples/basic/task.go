package main

import (
	"encoding/json"
	"github.com/hibiken/asynq"
	"log"
)

const (
	TypeEmailDeliveryC = "email:welcome"
)

const RedisAddr = "localhost:1000"

func main() {
	client := asynq.NewClient(asynq.RedisClientOpt{Addr: RedisAddr})
	EmailDeliveryPayload, _ := json.Marshal(map[string]interface{}{
		"userId": "123",
		"name":   "John Doe",
	})

	// create task
	task, err := client.Enqueue(asynq.NewTask(TypeEmailDeliveryC, EmailDeliveryPayload))
	if err != nil {
		log.Fatalf("could not enqueue task: %v", err)
	}

	log.Printf("task queued: %s", task.ID)
}
