// src/db/models/rooms.model.js
import { pool } from "../connection.js";

/**
 * Crear sala (pública o privada)
 */
export const createRoom = async ({ name, type, password_hash, created_by }) => {
  const query = `
    INSERT INTO rooms (name, type, password_hash, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, type, created_by, created_at;
  `;
  const values = [name, type, password_hash, created_by];
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Obtener todas las salas
 */
export const getAllRooms = async () => {
  const query = `
    SELECT id, name, type, created_by, created_at
    FROM rooms
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Obtener sala por ID
 */
export const getRoomById = async (room_id) => {
  const query = `
    SELECT id, name, type, password_hash, created_by, created_at
    FROM rooms
    WHERE id = $1;
  `;
  const result = await pool.query(query, [room_id]);
  return result.rows[0];
};

/**
 * Agregar usuario a una sala
 */
export const addUserToRoom = async (room_id, user_id) => {
  const query = `
    INSERT INTO room_members (room_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (room_id, user_id) DO NOTHING
    RETURNING id, room_id, user_id, joined_at;
  `;
  const result = await pool.query(query, [room_id, user_id]);
  return result.rows[0];
};

/**
 * Verificar si el usuario ya está en la sala
 */
export const isUserInRoom = async (room_id, user_id) => {
  const query = `
    SELECT id FROM room_members
    WHERE room_id = $1 AND user_id = $2
    LIMIT 1;
  `;
  const result = await pool.query(query, [room_id, user_id]);
  return result.rows.length > 0;
};
