import * as messageService from "../services/messages.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const sendMessage = asyncHandler(async(req, res) => {
  const { id } = req.params; // room_id
  const { content } = req.body;

  const result = await messageService.sendMessage({
    room_id: id,
    user_id: req.user.id,
    content,
  });

  return res.status(201).json(result);
});

export const getMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 0, limit = 20 } = req.query;

  const result = await messageService.getMessages({
    room_id: id,
    page,
    limit,
  });

  return res.status(200).json(result);
});
