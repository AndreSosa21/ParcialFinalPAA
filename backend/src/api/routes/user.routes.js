// src/api/routes/user.routes.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getProfile, updateUsername } from "../controllers/user.controller.js";
import { validateUpdateUser } from "../validators/user.validator.js";

const router = Router();

// Perfil del usuario
router.get("/me", requireAuth, getProfile);

// Actualizar username
router.put(
  "/username",
  requireAuth,
  validateUpdateUser,
  updateUsername
);

export default router;
