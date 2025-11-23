import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";
import { getUserByEmail, createUser } from "../../db/models/user.model.js";
import { pool } from "../../db/connection.js";

export const register = async ({ username, email, password }) => {
  const exists = await getUserByEmail(email);

  if (exists) {
    const err = new Error("Email already registered");
    err.statusCode = 409; // conflicto
    throw err;
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await createUser({ username, email, password_hash: hash });

  return {
    message: "User registered successfully",
    user,
  };
};

export const login = async ({ email, password }) => {
  const user = await getUserByEmail(email);

  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
}

  // 👉 Incrementar token_version (logout implícito)
  const updateQuery = `
    UPDATE users
    SET token_version = token_version + 1
    WHERE id = $1
    RETURNING token_version;
  `;
  const updated = await pool.query(updateQuery, [user.id]);
  const newVersion = updated.rows[0].token_version;

  // 👉 Generar nuevo token con token_version actualizado
  const token = generateToken({
    id: user.id,
    email: user.email,
    token_version: newVersion
  });

  return { token, user };
};
