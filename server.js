const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

//console.log(process.env); // process.env is available everywhere in application
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

// const test = ['ram', 'shyam'];pppp
// check = test.join(' and ');
// console.log(check);
const server = http.createServer(app);
const io = socketio(server);
//-------------------------------------------------------------------------------------------------

io.on('connection', (socket) => {
  console.log('New web_socket connection was established');

  socket.emit('message', 'Welcome');

  socket.broadcast.emit('message', 'A new user has joined');
  socket.on('send-msg', (message, callback) => {
    //this callback fn called here and executed at client side, where it is defined
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }
    io.emit('message', message);
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit(
      'message',
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback('Location shared');
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });
});

//--------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 2000;
server.listen(PORT, 'localhost', () => {
  console.log(`Server is listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

//#273742
