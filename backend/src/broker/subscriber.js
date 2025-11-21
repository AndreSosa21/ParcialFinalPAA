// src/broker/subscriber.js
import { getChannel } from "./connection.js";

const DEFAULT_QUEUE = "chat_messages";

/**
 * Suscribirse a la cola y manejar eventos entrantes
 */
export const subscribeToMessages = async (handler) => {
  try {
    const channel = getChannel();

    if (!channel) {
      throw new Error("RabbitMQ channel not initialized");
    }

    await channel.assertQueue(DEFAULT_QUEUE, {
      durable: true,
    });

    console.log("Worker subscribed to queue:", DEFAULT_QUEUE);

    channel.consume(DEFAULT_QUEUE, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());

        try {
          await handler(data);
          channel.ack(msg); // Confirmación al broker
        } catch (error) {
          console.error("Error handling message:", error);
          channel.nack(msg); // Reenvía el mensaje
        }
      }
    });
  } catch (error) {
    console.error("Error subscribing to queue:", error);
  }
};
