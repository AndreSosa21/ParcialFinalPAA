import jwt from "jsonwebtoken";
import { config } from "./env.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt_secret, {
    expiresIn: "2h",
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt_secret);
  } catch (err) {
    return null;
  }
};
