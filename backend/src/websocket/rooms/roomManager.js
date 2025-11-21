// src/websocket/rooms/roomManager.js

export class RoomManager {
  constructor() {
    this.rooms = new Map(); // room_id → Set(sockets)
  }

  /**
   * Agregar un socket a una sala
   */
  addSocketToRoom(room_id, socket) {
    if (!this.rooms.has(room_id)) {
      this.rooms.set(room_id, new Set());
    }
    this.rooms.get(room_id).add(socket);
    socket.rooms.add(room_id);
  }

  /**
   * Remover un socket de una sala
   */
  removeSocketFromRoom(room_id, socket) {
    if (this.rooms.has(room_id)) {
      this.rooms.get(room_id).delete(socket);
      socket.rooms.delete(room_id);
    }
  }

  /**
   * Remover socket de TODAS las salas
   */
  removeSocketFromAllRooms(socket) {
    for (const room_id of socket.rooms) {
      this.removeSocketFromRoom(room_id, socket);
    }
  }

  /**
   * Enviar un mensaje a todos los sockets de una sala
   */
  broadcastToRoom(room_id, event) {
    if (!this.rooms.has(room_id)) return;

    for (const socket of this.rooms.get(room_id)) {
      if (socket.readyState === 1) {
        socket.send(JSON.stringify(event));
      }
    }
  }
}
