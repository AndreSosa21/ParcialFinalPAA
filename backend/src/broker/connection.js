// src/broker/connection.js
import amqp from "amqplib";

let connection;
let channel;

/**
 * Conecta a RabbitMQ y crea un canal reutilizable
 */
export const connectBroker = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    console.log("RabbitMQ connected");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    process.exit(1);
  }
};

export const getChannel = () => channel;
export const getConnection = () => connection;
