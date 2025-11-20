-- Usuario inicial
INSERT INTO users (username, email, password_hash)
VALUES ('admin', 'admin@example.com', '123456hashed')
ON CONFLICT DO NOTHING;

-- Sala pública
INSERT INTO rooms (name, is_private, created_by)
VALUES ('General', FALSE, 1)
ON CONFLICT DO NOTHING;

-- Admin entra a General
INSERT INTO room_members (room_id, user_id)
VALUES (1, 1)
ON CONFLICT DO NOTHING;

-- Mensaje inicial
INSERT INTO messages (room_id, user_id, content)
VALUES (1, 1, 'Bienvenido al chat!')
ON CONFLICT DO NOTHING;