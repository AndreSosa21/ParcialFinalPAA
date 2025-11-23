// src/app.js
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./api/routes/auth.routes.js";
import roomRoutes from "./api/routes/rooms.routes.js";
import messageRoutes from "./api/routes/messages.routes.js";
import userRoutes from "./api/routes/user.routes.js";

import { testConnection } from "./db/connection.js";
import { connectBroker } from "./broker/connection.js";
import { initWebSocketServer } from "./websocket/index.js";
import { errorHandler } from "./api/middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas del API
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/messages", messageRoutes);
app.use("/user", userRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API + WS running 🎉" });
});

// Crear servidor HTTP
const server = http.createServer(app);

// Inicio secuencial del backend
const startApp = async () => {
  try {
    console.log("⏳ Starting backend...");

    await testConnection();       // PostgreSQL
    await connectBroker();        // RabbitMQ

    initWebSocketServer(server);  // WebSocket sobre HTTP

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};
app.use(errorHandler);
startApp();
