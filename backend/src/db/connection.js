// src/db/connection.js
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

/**
 * Pool de conexiones para PostgreSQL.
 * Reutilizable en toda la aplicación (API, Worker, WS).
 */
export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 10,                // Máximo de conexiones abiertas
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
