// src/api/validators/user.validator.js
import {
  validateFieldsComplete,
  validateStrings,
} from "../../middleware/validation.middleware.js";

export const validateUpdateUser = [
  validateAllowedFields(["username"]),
  validateFieldsComplete(["username"]),
  validateStrings(["username"]),
];
