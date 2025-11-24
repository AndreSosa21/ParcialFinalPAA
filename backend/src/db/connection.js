// src/db/connection.js
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

/**
 * Pool de conexiones para PostgreSQL.
 * Reutilizable en toda la aplicación (API, Worker, WS).
 */
export const pool = new Pool({
  // Soportamos tanto POSTGRES_* como DB_* por si cambiaste nombres
  host:
    process.env.POSTGRES_HOST ||
    process.env.DB_HOST ||
    "postgres",
  port: Number(process.env.POSTGRES_PORT || process.env.DB_PORT || 5432),
  user:
    process.env.POSTGRES_USER ||
    process.env.DB_USER ||
    "admin",
  password:
    process.env.POSTGRES_PASSWORD ||
    process.env.DB_PASSWORD ||
    "admin123",
  database:
    process.env.POSTGRES_DB ||
    process.env.DB_NAME ||
    "chatdb",
  max: 10, // Máximo de conexiones abiertas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificar conexión al iniciar el servidor
export const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected:", res.rows[0].now);
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    process.exit(1); // salir si falla
  }
};
