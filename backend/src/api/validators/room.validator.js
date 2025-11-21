// src/api/validators/room.validator.js
import {
  validateFieldsComplete,
  validateStrings,
  validateAllowedFields,
} from "../../middleware/validation.middleware.js";

export const validateCreateRoom = [
  validateAllowedFields(["name", "type", "password"]),
  validateFieldsComplete(["name", "type"]),
  validateStrings(["name", "type"]),
];

export const validateJoinRoom = [
  validateAllowedFields(["password"]),
  validateFieldsComplete(["password"]),
  validateStrings(["password"]),
];
