// src/api/services/rooms.service.js
import {
  createRoom as modelCreateRoom,
  getAllRooms,
  getRoomById,
  addUserToRoom,
  isUserInRoom,
} from "../../db/models/room.model.js";
import bcrypt from "bcryptjs";

export const createRoom = async (user_id, data) => {
  const { name, type, password } = data;

  // type → is_private (TRUE para privadas)
  const is_private = type === "private";

  let password_hash = null;

  if (is_private) {
    password_hash = await bcrypt.hash(password, 10);
  }

  const room = await modelCreateRoom({
    name,
    is_private,
    password_hash,
    created_by: user_id,
  });

  return room;
};

export const joinRoom = async (user_id, room_id, password) => {
  const room = await getRoomById(room_id);

  if (!room) throw new Error("Room not found");

  if (room.is_private) {
    const ok = await bcrypt.compare(password, room.password_hash);
    if (!ok) throw new Error("Invalid password for this room");
  }

  await addUserToRoom(room_id, user_id);

  return { message: "User joined room successfully" };
};

export const getRooms = async () => {
  return await getAllRooms();
};