// src/api/services/user.service.js
import {
  getUserById,
} from "../../db/models/user.model.js";

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (user_id) => {
  const user = await getUserById(user_id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * Actualizar username del usuario
 * (Solo como ejemplo, si decides permitirlo)
 */
export const updateUsername = async (user_id, new_username) => {
  const query = `
    UPDATE users
    SET username = $1
    WHERE id = $2
    RETURNING id, username, email, created_at;
  `;

  const values = [new_username, user_id];

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};
