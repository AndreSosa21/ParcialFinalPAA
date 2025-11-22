import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  validateCreateRoom,
  validateJoinRoom,
} from "../validators/room.validator.js";
import {
  createRoom,
  joinRoom,
  getRooms,
} from "../controllers/rooms.controller.js";

const router = Router();

router.post("/", requireAuth, validateCreateRoom, createRoom);
router.post("/:id/join", requireAuth, validateJoinRoom, joinRoom);
router.get("/", requireAuth, getRooms);

export default router;
