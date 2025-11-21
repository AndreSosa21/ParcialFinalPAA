// src/websocket/handlers/room.handler.js

export const handleJoinRoom = (socket, data, roomManager) => {
  const { room_id } = data;

  if (!room_id) {
    return socket.send(
      JSON.stringify({
        type: "error",
        message: "Missing room_id",
      })
    );
  }

  // Agregar socket a la sala
  roomManager.addSocketToRoom(room_id, socket);

  // Notificar a los usuarios de la sala
  roomManager.broadcastToRoom(room_id, {
    type: "user_joined",
    user_id: socket.user.id,
    room_id,
  });

  socket.send(
    JSON.stringify({
      type: "joined_room",
      room_id,
    })
  );

  console.log(`👤 User ${socket.user.id} joined WS room ${room_id}`);
};
