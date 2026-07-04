const amqp = require('amqplib');

async function start() {

    while (true) {

        try {

            console.log(
                'Connecting to RabbitMQ...'
            );

            const connection =
                await amqp.connect(
                    'amqp://rabbitmq'
                );

            const channel =
                await connection.createChannel();

            await channel.assertExchange(
                'order_events',
                'fanout',
                { durable: false }
            );

            const q =
                await channel.assertQueue(
                    '',
                    {
                        exclusive: true
                    }
                );

            channel.bindQueue(
                q.queue,
                'order_events',
                ''
            );

            console.log(
                'Notification service connected'
            );

            channel.consume(
                q.queue,
                msg => {

                    const data =
                        JSON.parse(
                            msg.content
                        );

                    console.log(
                        `Email sent to ${data.customer}`
                    );

                }
            );

            break;

        } catch (error) {

            console.log(
                'RabbitMQ not ready. Retrying in 5 seconds...'
            );

            await new Promise(
                resolve =>
                    setTimeout(resolve, 5000)
            );
        }
    }
}

start();