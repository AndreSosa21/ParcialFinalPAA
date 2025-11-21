import {
  insertMessage,
  getMessagesByRoom,
} from "../../db/models/messages.model.js";

export const sendMessage = async ({ room_id, user_id, content }) => {
  return await insertMessage({ room_id, user_id, content });
};

export const getMessages = async ({ room_id, page, limit }) => {
  const offset = page * limit;
  const msgs = await getMessagesByRoom({ room_id, limit, offset });

  return {
    page,
    limit,
    count: msgs.length,
    messages: msgs,
  };
};
