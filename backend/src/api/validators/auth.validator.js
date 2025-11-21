// src/api/validators/auth.validator.js
import {
  validateFieldsComplete,
  validateStrings,
  validateEmail,
  validatePasswordStrength,
} from "../../middleware/validation.middleware.js";

export const validateRegister = [
  validateFieldsComplete(["username", "email", "password"]),
  validateStrings(["username", "password"]),
  validateEmail(),
  validatePasswordStrength(),
];

export const validateLogin = [
  validateFieldsComplete(["email", "password"]),
  validateStrings(["email", "password"]),
  validateEmail(),
];
