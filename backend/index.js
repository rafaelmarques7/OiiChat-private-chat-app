const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('eventChatMessage', (msg) => {
    console.log('received eventChatMessage: ', msg)

    console.log('broadcasting eventChatMessage to everyone')
    io.emit('eventChatMessage', msg);
  })

})

server.listen(3000, () => {
  console.log('listening on *:3000');
});

