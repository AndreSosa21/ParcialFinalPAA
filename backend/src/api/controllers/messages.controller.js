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

export const getMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const query = `
      SELECT
        m.id,
        m.room_id,
        m.user_id,
        m.content,
        m.created_at,
        u.username AS username,
        u.email    AS email
      FROM messages m
      JOIN users u ON u.id = m.user_id
      WHERE m.room_id = $1
      ORDER BY m.created_at ASC;
    `;

    const result = await pool.query(query, [roomId]);
    return res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages by room:", err);
    return res.status(500).json({
      error: "Error",
      message: "No se pudieron cargar los mensajes de la sala",
    });
  }
};
