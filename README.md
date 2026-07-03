# Event-Driven Order Processing System

A simple event-driven microservice architecture built using Node.js, RabbitMQ, and Docker to demonstrate asynchronous communication patterns between distributed services.

## Architecture


Client
↓
Order Service
↓
RabbitMQ Exchange
├── Inventory Service
└── Notification Service


## Technologies

- Node.js
- Express.js
- RabbitMQ
- Docker
- Docker Compose

## Features

- Event publishing using RabbitMQ
- Publisher-Subscriber architecture
- Asynchronous service communication
- Distributed event processing
- Containerized message broker
