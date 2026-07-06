const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

let channel;

async function connect() {
  while (true) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect("amqp://rabbitmq-service");

      channel = await connection.createChannel();

      await channel.assertExchange("order_events", "fanout", {
        durable: false,
      });

      console.log("Connected to RabbitMQ");

      break;
    } catch (error) {
      console.log("RabbitMQ not ready. Retrying in 5 seconds...");

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

connect();

app.post("/orders", (req, res) => {
  const event = {
    event: "ORDER_CREATED",
    customer: req.body.customer,
    product: req.body.product,
    timestamp: new Date(),
  };

  channel.publish("order_events", "", Buffer.from(JSON.stringify(event)));

  console.log("Order published");

  res.json({
    message: "Order created",
  });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Order service listening on port 3000');
});
