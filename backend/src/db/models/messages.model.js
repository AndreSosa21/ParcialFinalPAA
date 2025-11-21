// src/db/models/messages.model.js
import { pool } from "../connection.js";

/**
 * Insertar un mensaje
 */
export const insertMessage = async ({ room_id, user_id, content }) => {
  const query = `
    INSERT INTO messages (room_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, room_id, user_id, content, created_at;
  `;
  const values = [room_id, user_id, content];
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Obtener mensajes paginados (por page y limit)
 */
export const getMessagesByRoom = async ({ room_id, limit, offset }) => {
  const query = `
    SELECT id, room_id, user_id, content, created_at
    FROM messages
    WHERE room_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const values = [room_id, limit, offset];
  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * Obtener mensajes recientes (para WebSocket o actualizaciones)
 */
export const getLatestMessages = async (room_id, limit = 20) => {
  const query = `
    SELECT id, room_id, user_id, content, created_at
    FROM messages
    WHERE room_id = $1
    ORDER BY created_at DESC
    LIMIT $2;
  `;
  const result = await pool.query(query, [room_id, limit]);
  return result.rows;
};
