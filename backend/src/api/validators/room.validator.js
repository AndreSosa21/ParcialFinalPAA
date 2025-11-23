// src/api/validators/room.validator.js
import {
  validateFieldsComplete,
  validateStrings,
  validateAllowedFields,
} from "../middleware/validations.middleware.js";
import { getRoomById } from "../../db/models/room.model.js";

export const validateCreateRoom = [
  validateAllowedFields(["name", "type", "password"]),
  validateFieldsComplete(["name", "type"]),
  validateStrings(["name", "type"]),
];

export const validateJoinRoom = async (req, res, next) => {
  try {
    const room_id = req.params.id;
    const room = await getRoomById(room_id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Si la sala es pública → NO se exige password
    if (!room.is_private) {
      return next();
    }

    // Si es privada → exigir password
    const { password } = req.body;

    if (!password || typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({
        message: "Password is required for private rooms.",
      });
    }

    next();

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Validator error", error: err.message });
  }
};
