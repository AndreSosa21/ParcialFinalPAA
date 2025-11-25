// backend/tests/unit/roomManager.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomManager } from '../../src/websocket/rooms/roomManager.js';

function createFakeSocket(readyState = 1) {
  return {
    rooms: new Set(),
    readyState,
    sent: [],
    send(msg) {
      this.sent.push(msg);
    }
  };
}

test('RoomManager agrega y elimina sockets de una sala', () => {
  const manager = new RoomManager();
  const socket = createFakeSocket();

  manager.addSocketToRoom('room-1', socket);
  assert.ok(manager.rooms.get('room-1').has(socket));
  assert.ok(socket.rooms.has('room-1'));

  manager.removeSocketFromRoom('room-1', socket);
  assert.ok(!socket.rooms.has('room-1'));
  assert.ok(!manager.rooms.get('room-1')?.has(socket));
});

test('RoomManager elimina socket de TODAS las salas', () => {
  const manager = new RoomManager();
  const socket = createFakeSocket();

  manager.addSocketToRoom('room-1', socket);
  manager.addSocketToRoom('room-2', socket);

  manager.removeSocketFromAllRooms(socket);

  assert.equal(socket.rooms.size, 0);
  assert.equal(manager.rooms.get('room-1')?.size ?? 0, 0);
  assert.equal(manager.rooms.get('room-2')?.size ?? 0, 0);
});

test('RoomManager broadcastToRoom solo envía a sockets conectados', () => {
  const manager = new RoomManager();
  const alive = createFakeSocket(1);
  const closed = createFakeSocket(0); // readyState != 1

  manager.addSocketToRoom('room-1', alive);
  manager.addSocketToRoom('room-1', closed);

  const event = { type: 'MESSAGE', content: 'Hola' };
  manager.broadcastToRoom('room-1', event);

  assert.equal(alive.sent.length, 1);
  const parsed = JSON.parse(alive.sent[0]);
  assert.equal(parsed.type, 'MESSAGE');
  assert.equal(parsed.content, 'Hola');

  // El socket closed no debería recibir nada
  assert.equal(closed.sent.length, 0);
});
