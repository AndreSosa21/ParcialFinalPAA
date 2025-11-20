-- Inserta muchos mensajes rápido (para stress test)
INSERT INTO messages (room_id, user_id, content)
SELECT 1, 1, 'Mensaje de prueba ' || generate_series(1, 5000);

-- Traer mensajes más recientes
SELECT * FROM messages
WHERE room_id = 1
ORDER BY created_at DESC
LIMIT 50;