import express from 'express';
import { Server } from 'socket.io';
import Filter from 'bad-words';
import path from 'path';
import http from 'http';
import { generateMessage, generateLocationMessage } from './utils/messages';
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error || !user) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit('message', generateMessage(`[ADMIN]`, `Welcome, ${user.username}`));
    socket.broadcast.to(user.room).emit('message', generateMessage(`[ADMIN]`, `${user.username} has joined!`));
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on('sendMessage', (msg, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      return callback('Profanity is not allowed!');
    }
    if (user) {
      io.to(user.room).emit('message', generateMessage(user.username, msg));
      callback();
    }
  });

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
      callback();
    }
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage(`[ADMIN]`, `${user.username} has left!`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

