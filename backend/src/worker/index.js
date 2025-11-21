// src/worker/index.js
import dotenv from "dotenv";
dotenv.config();

import { connectBroker } from "../broker/connection.js";
import { subscribeToMessages } from "../broker/subscriber.js";
import { handleMessageEvent } from "./consumers/message.consumer.js";
import { testConnection } from "../db/connection.js";

const startWorker = async () => {
  try {
    console.log("Starting worker...");

    // Verificar conexión a PostgreSQL
    await testConnection();

    // Conectar a RabbitMQ
    await connectBroker();

    // Suscribirse a la cola y procesar mensajes
    await subscribeToMessages(handleMessageEvent);

    console.log("Worker is up and listening for messages...");
  } catch (error) {
    console.error("Worker failed to start:", error);
    process.exit(1);
  }
};

startWorker();
