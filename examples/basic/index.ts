import { AsynqClient } from 'asynq-node';

const main = async () => {
    const client = new AsynqClient('redis://localhost:6379');

    const taskId = await client.enqueue('email:welcome', {
        userId: 123,
        name: 'John Doe',
    }, {
        processAt: new Date(Date.now() + 10_000), // schedule after 10s
    });

    console.log('Task enqueued with ID:', taskId);

    await client.disconnect();
};

main();
