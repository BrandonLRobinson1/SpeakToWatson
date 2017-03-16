var db = require('../config.js');

// Saved message user types to db to analyze at token page
module.exports.saveUser = function(username, password, imageUrl) {
  console.log('Inside user');
  console.log('in saveUser. these are its arguments',username,password,imageUrl)
  db.User.create({
    username: username,
    password: password,
    imageUrl: imageUrl
  }).then( () => { console.log('successfully saved user') } );
  
};

