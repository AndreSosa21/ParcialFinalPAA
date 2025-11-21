// src/db/models/users.model.js
import { pool } from "../connection.js";

/**
 * Obtener usuario por email
 */
export const getUserByEmail = async (email) => {
  const query = `
    SELECT id, username, email, password_hash, created_at
    FROM users
    WHERE email = $1
    LIMIT 1;
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

/**
 * Crear usuario nuevo
 */
export const createUser = async ({ username, email, password_hash }) => {
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
  `;
  const values = [username, email, password_hash];
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Obtener usuario por ID
 */
export const getUserById = async (id) => {
  const query = `
    SELECT id, username, email, created_at
    FROM users
    WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
