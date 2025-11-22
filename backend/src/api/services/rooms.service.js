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

  let password_hash = null;

  if (type === "private") {
    password_hash = await bcrypt.hash(password, 10);
  }

  const room = await modelCreateRoom({
    name,
    type,
    password_hash,
    created_by: user_id,
  });

  return room;
};

export const joinRoom = async (user_id, room_id, password) => {
  const room = await getRoomById(room_id);

  if (!room) throw new Error("Room not found");

  if (room.type === "private") {
    const ok = await bcrypt.compare(password, room.password_hash);
    if (!ok) throw new Error("Invalid password for this room");
  }

  await addUserToRoom(room_id, user_id);

  return { message: "User joined room successfully" };
};

export const getRooms = async () => {
  return await getAllRooms();
};
