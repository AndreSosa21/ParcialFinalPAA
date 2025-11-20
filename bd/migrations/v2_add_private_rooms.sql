-- Migración 2: soporte para salas privadas

ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;

ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS password_hash TEXT;