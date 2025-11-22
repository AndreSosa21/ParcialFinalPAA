import * as roomService from "../services/rooms.service.js";

export const createRoom = async (req, res) => {
  const room = await roomService.createRoom(req.user.id, req.body);
  return res.status(201).json(room);
};

export const joinRoom = async (req, res) => {
  const { id } = req.params;
  const result = await roomService.joinRoom(req.user.id, id, req.body.password);
  return res.status(200).json(result);
};

export const getRooms = async (req, res) => {
  const rooms = await roomService.getRooms();
  return res.status(200).json(rooms);
};
