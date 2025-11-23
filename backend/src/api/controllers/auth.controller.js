import * as userService from "../services/auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const result = await userService.register({ username, email, password });
  return res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.login({ email, password });
  return res.status(200).json(result);
});