const amqp = require("amqplib");

async function start() {
  while (true) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect('amqp://rabbitmq-service');

      const channel = await connection.createChannel();

      await channel.assertExchange("order_events", "fanout", {
        durable: false,
      });

      const q = await channel.assertQueue("", {
        exclusive: true,
      });

      channel.bindQueue(q.queue, "order_events", "");

      console.log("Inventory connected");

      channel.consume(q.queue, (msg) => {
        const data = JSON.parse(msg.content);

        console.log("Inventory reserved:", data.product);
      });

      break;
    } catch (err) {
      console.log("RabbitMQ not ready, retrying...");

      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

start();
