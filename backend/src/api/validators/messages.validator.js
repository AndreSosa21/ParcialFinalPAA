// src/api/validators/message.validator.js
import {
  validateFieldsComplete,
  validateStrings,
  validateAllowedFields,
} from "../../middleware/validation.middleware.js";

export const validateSendMessage = [
  validateAllowedFields(["content"]),
  validateFieldsComplete(["content"]),
  validateStrings(["content"]),
];
