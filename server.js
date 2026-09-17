const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true }
});

const PORT = Number(process.env.PORT || 9000);
const rooms = new Map();

app.use(express.static(__dirname));
app.get('/health', (_req, res) => res.json({ ok: true, rooms: rooms.size }));

function createRoomId() {
  let roomId = '';
  do {
    roomId = crypto.randomBytes(4).toString('hex').toUpperCase();
  } while (rooms.has(roomId));
  return roomId;
}

function leaveRoom(socket) {
  const roomId = socket.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;

  room.players.delete(socket.id);
  socket.leave(roomId);
  socket.data.roomId = null;
  socket.to(roomId).emit('opponent-left');
  if (room.players.size === 0) rooms.delete(roomId);
}

io.on('connection', socket => {
  socket.on('create-room', ({ heroId, gridSize } = {}) => {
    leaveRoom(socket);
    const roomId = createRoomId();
    rooms.set(roomId, {
      hostId: socket.id,
      players: new Set([socket.id]),
      gridSize: Number(gridSize) || 5,
      hero1Id: heroId || null
    });
    socket.data.roomId = roomId;
    socket.data.role = 'HOST';
    socket.join(roomId);
    socket.emit('room-created', { roomId, gridSize: Number(gridSize) || 5 });
  });

  socket.on('join-room', ({ roomId, heroId } = {}) => {
    const normalized = String(roomId || '').replace(/[^a-z0-9]/gi, '').toUpperCase();
    const room = rooms.get(normalized);
    if (!room) {
      socket.emit('room-error', 'Room not found. Ask the host for a fresh room link.');
      return;
    }
    if (room.players.size >= 2) {
      socket.emit('room-error', 'That room is already full.');
      return;
    }

    leaveRoom(socket);
    room.players.add(socket.id);
    socket.data.roomId = normalized;
    socket.data.role = 'CLIENT';
    socket.join(normalized);
    socket.emit('room-joined', { roomId: normalized, gridSize: room.gridSize, hero1Id: room.hero1Id });
    socket.to(normalized).emit('opponent-joined', { heroId: heroId || null });
  });

  socket.on('room-message', ({ roomId, message } = {}) => {
    const normalized = String(roomId || socket.data.roomId || '').toUpperCase();
    if (!message || socket.data.roomId !== normalized || !rooms.has(normalized)) return;
    socket.to(normalized).emit('room-message', message);
  });

  socket.on('disconnect', () => leaveRoom(socket));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ArgosWOP TCG server listening on http://0.0.0.0:${PORT}`);
});
