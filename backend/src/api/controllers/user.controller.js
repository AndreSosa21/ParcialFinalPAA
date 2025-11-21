import * as userService from "../services/user.service.js";

export const getProfile = async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  return res.status(200).json(user);
};

export const updateUsername = async (req, res) => {
  const { username } = req.body;
  const user = await userService.updateUsername(req.user.id, username);
  return res.status(200).json({ message: "Username updated", user });
};
