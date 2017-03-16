var Sequelize = require('sequelize');


if (process.env.CLEARDB_DATABASE_URL) { // FOR HEROKU DEPLOYMENT
  var sequelize = new Sequelize('mysql://b5a7a9a0714f26:ed513952@us-cdbr-iron-east-04.cleardb.net/heroku_ffc37eb62708e4e?reconnect=true');
} else {
  var sequelize = new Sequelize('turnip', 'root', process.env.MYSQL_PASSWORD, { // FOR DEVELOPMENT
    host: 'localhost',
    dialect: 'mysql'
  });
}


var Chatroom = sequelize.define('chatrooms', {
  roomName: {type: Sequelize.STRING, field: 'room_name'},
  firstUser: {type: Sequelize.STRING, field: 'first_user'},
  secondUser: {type: Sequelize.STRING, field: 'second_user'},
  session: {type: Sequelize.INTEGER, field: 'session'}
});

var Message = sequelize.define('messages', {
  text: {type: Sequelize.STRING,field: 'text'},
  user: {type: Sequelize.STRING},
  opponent: {type: Sequelize.STRING},
  chatroom: {type: Sequelize.STRING},
  session: {type: Sequelize.INTEGER}
});

var User = sequelize.define('users', {
  username: {type: Sequelize.STRING, field: 'username', unique: true},
  password: {type: Sequelize.STRING, field: 'password'},
  imageUrl: {type: Sequelize.STRING,field: 'image_url'}
});

// Starter chatrooms
Chatroom.sync({force: true}).then(function () {
  Chatroom.create({
    roomName: 'Hillary v Donald',
    firstUser: null,
    secondUser: null,
    session: null
  });
  Chatroom.create({
    roomName: 'Emacs v Vim',
    firstUser: null,
    secondUser: null,
    session: null
  });
  Chatroom.create({
    roomName: 'McDonalds v Burger King',
    firstUser: null,
    secondUser: null,
    session: null
  });
  Chatroom.create({
    roomName: 'Coke v Pepsi',
    firstUser: null,
    secondUser: null,
    session: null
  });
  Chatroom.create({
    roomName: 'Blue v Black',
    firstUser: null,
    secondUser: null,
    session: null
  });
});

// Dummy messages for testing
Message.sync({force: false}).then(function () {
  Message.create({
    text: 'Hi!',
    user: 'James',
    opponent: 'Matt',
    chatroom: 'Hillary v Donald',
    session: 1
  });
  Message.create({
    text: 'Hey!',
    user: 'Matt',
    opponent: 'James',
    chatroom: 'Hillary v Donald',
    session: 1
  });
  Message.create({
    text: 'How are you?',
    user: 'James',
    opponent: 'Matt',
    chatroom: 'Hillary v Donald',
    session: 1
  });
  Message.create({
    text: 'Good. How about you?',
    user: 'Matt',
    opponent: 'James',
    chatroom: 'Hillary v Donald',
    session: 1
  });
  Message.create({
    text: 'No complaints. Do you like Trump?',
    user: 'James',
    opponent: 'Matt',
    chatroom: 'Hillary v Donald',
    session: 1
  });
  Message.create({
    text: 'Not really.',
    user: 'Matt',
    opponent: 'James',
    chatroom: 'Hillary v Donald',
    session: 1
  });
  Message.create({
    text: 'Anyone home?',
    user: 'James',
    opponent: 'Matt',
    chatroom: 'Blue v Black',
    session: 2
  });
  Message.create({
    text: 'No. Go away.!',
    user: 'Matt',
    opponent: 'James',
    chatroom: 'Blue v Black',
    session: 2
  });
});

// Dummy users for testing
User.sync({force: true}).then(function () {
  User.create({
    username: 'James',
    password: 'james',
    imageUrl: 'https://avatars2.githubusercontent.com/u/18106668?v=3&s=460'
  });
  User.create({
    username: 'Evan',
    password: 'evan',
    imageUrl: 'https://avatars1.githubusercontent.com/u/20055140?v=3&s=460'
  });
  User.create({
    username: 'David',
    password: 'david',
    imageUrl: 'https://avatars1.githubusercontent.com/u/10459856?v=3&s=460'
  });
  User.create({
    username: 'Matt',
    password: 'matt',
    imageUrl: 'https://avatars1.githubusercontent.com/u/10934811?v=3&s=460'
  });
});

module.exports.Chatroom = Chatroom;
module.exports.Message = Message;
module.exports.User = User;
