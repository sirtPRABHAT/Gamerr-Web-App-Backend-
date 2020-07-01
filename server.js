const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { createMessage, createLocationMessage } = require('./utils/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/users');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(process.env.NODE_ENV);
const db = process.env.HOSTED_DATABASE_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('Database is connected');
  });

const server = http.createServer(app);
const io = socketio(server);
//--------------------------------socket.io-----------------------------------------------------------------

io.on('connection', (socket) => {
  console.log('New web_socket connection was established');

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit('message', createMessage('Admin', 'Welcome'));
    socket.broadcast
      .to(user.room)
      .emit('message', createMessage('Admin', `${user.username} has joined`));

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('send-msg', (message, callback) => {
    const user = getUser(socket.id);
    //this callback fn called here and executed at client side, where it is defined
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }
    io.to(user.room).emit('message', createMessage(user.username, message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      'locationMessage',
      createLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback('Location shared');
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        createMessage('Admin', `${user.username} has left`)
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

//---------------------------------socket.io-----------------------------------------------------------
const PORT = process.env.PORT || 1000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED, Shutting down gracefully!!');
  server.close(() => {
    console.log('Process Terminated');
  });
});
