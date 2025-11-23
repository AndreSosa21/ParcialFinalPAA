import * as userService from "../services/user.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getProfile = asyncHandler(async(req, res) => {
  const user = await userService.getProfile(req.user.id);
  return res.status(200).json(user);
});

export const updateUsername = asyncHandler(async(req, res) => {
  const { username } = req.body;
  const user = await userService.updateUsername(req.user.id, username);
  return res.status(200).json({ message: "Username updated", user });
});
