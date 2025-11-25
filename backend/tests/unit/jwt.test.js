// backend/tests/unit/jwt.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateToken, verifyToken } from '../../src/utils/jwt.js';

// Asegúrate de que el .env esté cargado al correr los tests
// (NODE_ENV=development + JWT_SECRET ya está en backend/.env)

test('generateToken y verifyToken preservan el payload básico', () => {
  const payload = { id: 123, email: 'test@example.com', token_version: 1 };

  const token = generateToken(payload);

  assert.ok(token, 'Debe devolver un token no vacío');

  const decoded = verifyToken(token);

  assert.equal(decoded.id, payload.id);
  assert.equal(decoded.email, payload.email);
  assert.equal(decoded.token_version, payload.token_version);
});

test('verifyToken devuelve null con token inválido', () => {
  const decoded = verifyToken('token.totalmente.invalido');
  assert.equal(decoded, null);
});
