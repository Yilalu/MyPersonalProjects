const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS library

const app = express();

app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);

    socket.on('signal', (data) => {
      io.to(data.targetSocketId).emit('signal', data);
    });

    socket.broadcast.to(roomId).emit('user-connected', socket.id);

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', socket.id);
    });
    socket.on("share-file", ({ roomId, file }) => {
        socket.to(roomId).emit("receive-file", file);
      });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
