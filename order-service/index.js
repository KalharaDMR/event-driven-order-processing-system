const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

let channel;

async function connect() {
    const connection =
        await amqp.connect('amqp://localhost');

    channel = await connection.createChannel();

    await channel.assertExchange(
        'order_events',
        'fanout',
        { durable: false }
    );
}

connect();

app.post('/orders', (req, res) => {

    const event = {
        event: 'ORDER_CREATED',
        customer: req.body.customer,
        product: req.body.product,
        timestamp: new Date()
    };

    channel.publish(
        'order_events',
        '',
        Buffer.from(JSON.stringify(event))
    );

    console.log('Order published');

    res.json({
        message: 'Order created'
    });
});

app.listen(3000);