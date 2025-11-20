SELECT
    r.id AS room_id,
    r.name,
    r.is_private,
    rm.joined_at
FROM room_members rm
JOIN rooms r ON r.id = rm.room_id
WHERE rm.user_id = $1
ORDER BY rm.joined_at DESC;