// src/websocket/index.js
import { WebSocketServer } from "ws";
import { verifyToken } from "../utils/jwt.js";
import { RoomManager } from "./rooms/roomManager.js";
import { handleIncomingMessage } from "./handlers/message.handler.js";
import { handleJoinRoom } from "./handlers/room.handler.js";
import { handleConnection } from "./handlers/connection.handler.js";

export const initWebSocketServer = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer });

  const roomManager = new RoomManager();

  wss.on("connection", (socket, req) => {
    // Extraer token del query param ?token=...
    const params = new URLSearchParams(req.url.replace("/?", ""));
    const token = params.get("token");

    if (!token) {
      socket.close();
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      socket.close();
      return;
    }

    socket.user = decoded; // attach user
    socket.rooms = new Set();

    handleConnection(socket);

    socket.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);

        if (data.type === "join_room") {
          handleJoinRoom(socket, data, roomManager);
        }

        if (data.type === "send_message") {
          handleIncomingMessage(socket, data, roomManager);
        }
      } catch (err) {
        console.error("❌ WS message error:", err);
      }
    });

    socket.on("close", () => {
      roomManager.removeSocketFromAllRooms(socket);
    });
  });

  console.log("⚡ WebSocket server running");
};
