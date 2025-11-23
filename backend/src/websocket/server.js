// backend/src/websocket/server.js
import http from "http";
import dotenv from "dotenv";
import { initWebSocketServer } from "./index.js";
import { connectBroker } from "../broker/connection.js";

dotenv.config();

// Crear servidor HTTP vacío (sin Express)
const server = http.createServer();
const PORT = process.env.WS_PORT || 3001;

const start = async () => {
  try {
    // 1. Conectar a RabbitMQ (crea connection + channel reutilizable)
    await connectBroker();

    // 2. Inicializar WebSocket sobre el server HTTP
    initWebSocketServer(server);

    // 3. Empezar a escuchar
    server.listen(PORT, () => {
      console.log(`🔥 WebSocket server running on ws://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start WebSocket server:", err);
    process.exit(1);
  }
};

start();
