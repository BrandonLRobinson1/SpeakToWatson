var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
// Export for sockets
module.exports.server = server;
// var io = require('socket.io')(server);
var db = require('./app/config.js');
var Sequelize = require('sequelize');
var session = require('express-session');

//watson
var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var conversation = new ConversationV1({
username: 'a8ece90b-de5d-45c0-a1b7-829b46e8f3d1', // replace with username from service key
password: 'Excel47iUHDa', // replace with password from service key
path: { workspace_id: 'f78e9c65-7abc-4440-8962-5d1dba2a87f6' }, // replace with workspace ID
version_date: '2016-07-11'
});

// Controller dependencies
var ChatroomCtrl = require('./app/controllers/chatroom.js');
var MessageCtrl = require('./app/controllers/message.js');
var utils = require('./app/utils.js');

// Environment variables
var port = 1337;
// var port = process.env.PORT || 1337;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'COOKIE'}));
app.use(express.static(__dirname + '/../client'));

////////////////////////////////////////////////////////////////////////////////
// SOCKET.IO
////////////////////////////////////////////////////////////////////////////////
var sockets = require('./sockets.js');
app.use(express.static('socket.io'));
////////////////////////////////////////////////////////////////////////////////

// Routes
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/../client/index.html');
});

// need to consolidate
app.get('/lobby', ChatroomCtrl.fetchRooms);
app.get('/getChatrooms', ChatroomCtrl.getChatrooms);
app.get('/chatrooms', ChatroomCtrl.getRooms);

app.put('/lobby', ChatroomCtrl.updateLobbyRooms);
app.put('/chatrooms', ChatroomCtrl.updateRoomSession);
app.post('/leavechatroom', ChatroomCtrl.leaveChatroom);
app.post('/watson', ChatroomCtrl.watson) 

app.get('/messages/session-next', MessageCtrl.findNextUniqueSessionID);
app.get('/token', MessageCtrl.findMessageByUsername);
app.post('/messages', MessageCtrl.saveMessage);

app.get('/validLogin', utils.getUsername);
app.post('/users', utils.setUsername);
app.post('/logout', utils.logout);

console.log('Server running on port', port);
server.listen(port, function() {});
