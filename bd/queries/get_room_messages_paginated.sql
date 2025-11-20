-- Obtener historial con cursor
SELECT
    id,
    room_id,
    user_id,
    content,
    created_at
FROM messages
WHERE room_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;