var db = require('../config.js');

//watson
var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var conversation = new ConversationV1({
username: 'a8ece90b-de5d-45c0-a1b7-829b46e8f3d1', // replace with username from service key
password: 'Excel47iUHDa', // replace with password from service key
path: { workspace_id: 'f78e9c65-7abc-4440-8962-5d1dba2a87f6' }, // replace with workspace ID
version_date: '2016-07-11'
});

// Gets all rooms from db
module.exports.fetchRooms = function(req, res) {
  db.Chatroom.findAll({})
  .then(function(rooms) {
    res.send(JSON.stringify(rooms));
  });
};

// Updated occupants in rooms in Lobby view
module.exports.updateLobbyRooms = function(req, res) {
  db.Chatroom.find({ where: { roomName: req.body.chatroomName } })
  .then(function(room) {
    if (room) {
      // Set session variables to be able to delete name after leaving / logging out
      req.session.user = req.body.user;
      req.session.chatroomName = req.body.chatroomName;

      // Update chatroom depending on if entering as user 1 or user 2
      if (req.body.user === 1) {
        room.updateAttributes({
          firstUser: req.body.username,
        });
      } else {
        room.updateAttributes({
          secondUser: req.body.username
        });
      }
    } else {
      res.send('Error on updating given chatroom name');
    }
  })
  .then(function(room) {
    console.log('Successfully posted new username into db chatrooms');
    res.send(room);
  });
};

// Update room session
module.exports.updateRoomSession = function(req, res) {
  console.log(req.body, "PUT /chatrooms request!")
  db.Chatroom.find({ where: { roomName: req.body.roomName } })
  .then(function(room) {
    room.updateAttributes({
      session: req.body.session
    });
    res.send('Added session to room.');
  });
};



module.exports.watson = function(req,res){

  // make sure that req.body.input is a string.
  // need to save the previous context and pass in previous context at every new request. 
 
  console.log(req.body.context , ' contexxxt passed in')
  console.log('expect req.body.data to be different strings',req.body.text)

  conversation.message({
    input: {'text': req.body.text},
    context: req.body.context
  }, function(err, response) {
    // console.log('this is the response: ',response)
    if(err) {
      console.log('error:', err);
    }
    else {
      console.log(JSON.stringify(response, null, 2));
      var context = response.context
      console.log(response.context, ' expect to be response from watson');
      res.send(JSON.stringify(response))
    }
  });
};




//Add comment


// Remove user from chatroom in DB when leaving
module.exports.leaveChatroom = function(req, res) {
  db.Chatroom.find({ where: { roomName: req.session.chatroomName } })
  .then(function(room) {
    if (room) {
      if (req.session.user === 1) {
        room.updateAttributes({
          firstUser: null,
        });
      } else {
        room.updateAttributes({
          secondUser: null
        });
      }
    } else {
      res.send('Error on updating given chatroom users');
    }
  })
  .then(function(room) {
    console.log('Successfully removed username from db chatroom');
    res.send(room);
  });
};

/////////////////////////////////////////////////////////////////
// TO BE DELETED 
/////////////////////////////////////////////////////////////////
module.exports.getRooms = function(req, res) {
  db.Chatroom.findAll({})
  .then(function(chatrooms) {
    res.send(chatrooms);
  });
};

module.exports.getChatrooms = function(req, res) {
  db.Chatroom.findAll({})
  .then(function(rooms) {
    res.send(rooms);
  })
};