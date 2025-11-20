-- Migración 3: soporte para paginación basada en cursor

ALTER TABLE messages
ADD COLUMN IF NOT EXISTS cursor_id BIGSERIAL;

-- Cursor único incremental
CREATE UNIQUE INDEX IF NOT EXISTS idx_messages_cursor
    ON messages (cursor_id);