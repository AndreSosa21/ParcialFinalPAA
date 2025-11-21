// src/websocket/handlers/connection.handler.js

export const handleConnection = (socket) => {
  console.log(`🔌 User connected: ${socket.user.email}`);

  socket.send(
    JSON.stringify({
      type: "connected",
      message: "WebSocket connection established",
    })
  );
};
