// src/utils/jwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Genera un JWT firmado con el secreto del .env
 * @param {Object} payload - Datos a incluir en el token (id, email)
 */
export const generateToken = ({ id, email, token_version }) => {
  return jwt.sign(
    { id, email, token_version },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};



/**
 * Verifica un token JWT
 * @param {String} token - El token recibido del cliente
 * @returns {Object|null} - El payload decodificado o null si es inválido
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // token expirado o inválido
  }
};


