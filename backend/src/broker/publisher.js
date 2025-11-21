// src/broker/publisher.js
import { getChannel } from "./connection.js";

const DEFAULT_QUEUE = "chat_messages";

/**
 * Publicar mensaje en la cola (worker lo consumirá)
 */
export const publishMessageEvent = async (event) => {
  try {
    const channel = getChannel();

    if (!channel) {
      throw new Error("RabbitMQ channel not initialized");
    }

    await channel.assertQueue(DEFAULT_QUEUE, {
      durable: true,
    });

    channel.sendToQueue(
      DEFAULT_QUEUE,
      Buffer.from(JSON.stringify(event)),
      { persistent: true }
    );

    console.log("Message published to RabbitMQ:", event);
  } catch (error) {
    console.error("Error publishing message:", error);
  }
};
