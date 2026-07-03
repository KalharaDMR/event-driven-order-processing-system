const amqp = require('amqplib');

async function start() {

    const connection =
        await amqp.connect('amqp://localhost');

    const channel =
        await connection.createChannel();

    await channel.assertExchange(
        'order_events',
        'fanout',
        { durable: false }
    );

    const q =
        await channel.assertQueue('', {
            exclusive: true
        });

    channel.bindQueue(
        q.queue,
        'order_events',
        ''
    );

    channel.consume(q.queue, msg => {

        const data =
            JSON.parse(msg.content);

        console.log(
            'Inventory reserved:',
            data.product
        );

    });
}

start();