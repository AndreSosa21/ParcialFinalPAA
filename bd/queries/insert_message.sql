INSERT INTO messages (room_id, user_id, content)
VALUES ($1, $2, $3)
RETURNING id, room_id, user_id, content, created_at;