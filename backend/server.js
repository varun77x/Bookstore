const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

let canvasState = '';
let connectedUsers = new Set();

io.on('connection', (socket) => {
  const username = socket.handshake.query.username;
  console.log(`User ${username} connected`);
  
  connectedUsers.add(username);
  
  if (canvasState) {
    socket.emit('canvas-state', canvasState);
  }

  io.emit('users-update', Array.from(connectedUsers));

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  socket.on('update-canvas-state', (state) => {
    canvasState = state;
    socket.broadcast.emit('canvas-state', state);
  });

  socket.on('disconnect', () => {
    console.log(`User ${username} disconnected`);
    connectedUsers.delete(username);
    io.emit('users-update', Array.from(connectedUsers));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});