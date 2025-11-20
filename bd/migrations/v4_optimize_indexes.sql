-- Migración 4: Optimización general

CREATE INDEX IF NOT EXISTS idx_messages_room_created 
    ON messages (room_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_room_members_user
    ON room_members (user_id);

CREATE INDEX IF NOT EXISTS idx_room_members_room
    ON room_members (room_id);