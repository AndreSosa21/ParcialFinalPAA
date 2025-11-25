// backend/tests/integration/api-flow.test.js
import test from 'node:test';
import assert from 'node:assert/strict';

// Puedes sobreescribirlo con API_BASE_URL=http://host:puerto
const baseURL = process.env.API_BASE_URL ?? 'http://localhost:3000';

async function registerUser(email) {
  const res = await fetch(`${baseURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'test-user',
      email,
      password: 'Test1234!'
    })
  });

  const body = await res.json().catch(() => ({}));
  return { res, body };
}

async function loginUser(email) {
  const res = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'Test1234!'
    })
  });

  const body = await res.json();
  return { res, body };
}

test('flujo: register + login + create room + join room + mensajes', async () => {
  const unique = Date.now();
  const email = `test${unique}@example.com`;

  // 1) Registrar usuario
  const { res: resReg } = await registerUser(email);
  assert.ok([201, 409].includes(resReg.status), `Esperaba 201 o 409, recibí ${resReg.status}`);

  // 2) Login
  const { res: resLogin, body: loginBody } = await loginUser(email);
  assert.equal(resLogin.status, 200);
  assert.ok(loginBody.token, 'El login debe devolver token');
  const token = loginBody.token;

  // 3) Crear sala privada
  const resCreateRoom = await fetch(`${baseURL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: `Sala de prueba ${unique}`,
      type: 'private',
      password: 'secret123'
    })
  });

  assert.equal(resCreateRoom.status, 201);
  const room = await resCreateRoom.json();
  assert.ok(room.id, 'La sala creada debe tener id');

  // 4) Unirse a la sala
  const resJoin = await fetch(`${baseURL}/rooms/${room.id}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      password: 'secret123'
    })
  });

  assert.equal(resJoin.status, 200);
  const joinBody = await resJoin.json();
  assert.ok(joinBody.message);

  // 5) Listar salas
  const resList = await fetch(`${baseURL}/rooms`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  assert.equal(resList.status, 200);
  const rooms = await resList.json();
  assert.ok(Array.isArray(rooms));
  assert.ok(rooms.some(r => r.id === room.id), 'La sala creada debe aparecer en el listado');

  // 6) Enviar mensaje en la sala
  const resSendMsg = await fetch(`${baseURL}/messages/${room.id}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content: 'Hola desde test' })
  });

  assert.equal(resSendMsg.status, 201);

  // 7) Obtener historial de mensajes
  const resGetMsgs = await fetch(
    `${baseURL}/messages/${room.id}/messages?page=0&limit=10`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  assert.equal(resGetMsgs.status, 200);
  const payload = await resGetMsgs.json();

  // Soportar los 2 posibles formatos:
  //  a) { page, limit, count, messages: [...] }
  //  b) [ { ... } ]
  let messages = [];
  if (Array.isArray(payload)) {
    messages = payload;
  } else if (Array.isArray(payload.messages)) {
    messages = payload.messages;
  } else {
    throw new Error('Formato de respuesta de mensajes no esperado');
  }

  assert.ok(messages.length >= 1, 'Debe haber al menos 1 mensaje en la sala');
});
