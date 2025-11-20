-- Búsqueda rápida de mensajes por sala y fecha
CREATE INDEX IF NOT EXISTS idx_messages_room_created 
    ON messages (room_id, created_at DESC);

-- Para buscar qué salas tiene un usuario
CREATE INDEX IF NOT EXISTS idx_room_members_user
    ON room_members (user_id);

-- Para ver miembros de una sala
CREATE INDEX IF NOT EXISTS idx_room_members_room
    ON room_members (room_id);