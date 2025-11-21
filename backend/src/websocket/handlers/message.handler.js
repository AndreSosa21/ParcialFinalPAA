// src/websocket/handlers/message.handler.js
import { publishMessageEvent } from "../../broker/publisher.js";

export const handleIncomingMessage = async (socket, data, roomManager) => {
  const { room_id, content } = data;

  if (!room_id || !content) {
    return socket.send(
      JSON.stringify({
        type: "error",
        message: "Missing room_id or content",
      })
    );
  }

  // Publicar evento al broker (RabbitMQ)
  await publishMessageEvent({
    room_id,
    user_id: socket.user.id,
    content,
    timestamp: Date.now(),
  });

  // Enviar a todos en la sala
  roomManager.broadcastToRoom(room_id, {
    type: "new_message",
    room_id,
    user_id: socket.user.id,
    content,
    timestamp: Date.now(),
  });

  console.log(`✉️ Message WS → room ${room_id}`);
};
