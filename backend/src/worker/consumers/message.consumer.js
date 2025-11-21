// src/worker/consumers/message.consumer.js
import { insertMessage } from "../../db/models/messages.model.js";

/**
 * Consumer que procesa los eventos de mensajes provenientes de RabbitMQ.
 * Espera un objeto con: room_id, user_id, content, timestamp
 */
export const handleMessageEvent = async (event) => {
  const { room_id, user_id, content } = event;

  if (!room_id || !user_id || !content) {
    console.error("Invalid event payload:", event);
    return;
  }

  // Guarda el mensaje en la base de datos
  await insertMessage({
    room_id,
    user_id,
    content,
  });

  console.log(
    `💾 Message persisted in DB for room ${room_id} from user ${user_id}`
  );
};
