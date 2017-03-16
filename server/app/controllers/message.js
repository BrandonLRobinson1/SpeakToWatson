var db = require('../config.js');

// Saved message user types to db to analyze at token page
module.exports.saveMessage = function(req, res) {
  console.log('Inside savemessage');
  db.Message.create({
    text: req.body.text,
    user: req.body.user,
    chatroom: req.body.chatRoom,
    opponent: req.body.opponent,
    session: req.body.session
  })
  .then(function() {
    console.log('Successfully saved message to DB');
    res.send('Some random message: posted to messages route');
  });
};

// Figure out what the next unique session ID should be
module.exports.findNextUniqueSessionID = function(req, res) {
  db.Message.aggregate('session', 'DISTINCT', {plain: false})
  .then(function(count) {
    var next = count.length + 1;
    res.send(next.toString());
  });
};

// Find messages with matching session username
module.exports.findMessageByUsername = function(req, res) {
  console.log('find mesage by username =============')
  db.Message.findAll({where: { user: req.session.username}})
  .then(function(messages) {
    res.send(messages);
  });
}