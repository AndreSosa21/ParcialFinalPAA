import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateSendMessage } from "../validators/messages.validator.js";
import {
  sendMessage,
  getMessages,
} from "../controllers/messages.controller.js";

const router = Router();

router.post("/:id/messages", requireAuth, validateSendMessage, sendMessage);
router.get("/:id/messages", requireAuth, getMessages);

export default router;
