// src/api/validators/user.validator.js
import {
  validateAllowedFields,
  validateFieldsComplete,
  validateStrings
} from "../middleware/validations.middleware.js";

export const validateUpdateUser = [
  validateAllowedFields(["username"]),
  validateFieldsComplete(["username"]),
  validateStrings(["username"])
];
