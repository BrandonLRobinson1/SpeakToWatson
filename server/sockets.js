var app = require('./server.js');
var io = require('socket.io')(app.server);

// =============================================================================
// CHATROOM SOCKET
// =============================================================================
var chatroom1 = io.of('/chatroom');

chatroom1.on('connection', function(socket) {
  socket.on('enter', function(username, room) {
    socket.join(room);
    socket.to(room).emit('opponent enter', username);
  });
  socket.on('leave', function(username, room) {
    socket.to(room).emit('opponent leave', username);
    socket.leave(room);
  });
  socket.on('chat message', function(username, message, room) {
    socket.to(room).emit('posted message', username + ': ' + message);
  });
  socket.on('typing', function(username, msg, room) {
    socket.to(room).emit('typing message', username, msg);
  });
});

module.exports.chatroom1 = chatroom1;

// =============================================================================
// LOBBY SOCKET
// =============================================================================
var lobby1 = io.of('/lobby');

lobby1.on('connection', function(socket) {
  // For live updates when another user enters a chatroom
  socket.on('user enters room', function(username, user, roomName) {
    socket.broadcast.emit('other user enters room', username, user, roomName);
  });
  socket.on('user leaves room', function(username, user, roomName) {
    socket.broadcast.emit('other user leaves room', username);
  });
});

module.exports.lobby1 = lobby1;