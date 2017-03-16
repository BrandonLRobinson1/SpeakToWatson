var services = angular.module('argue.lobby.service', []);

services.factory('Lobby', function($location, $http) {
  var validateUser = function(cb) {
    return $http({
      method: 'GET',
      url: '/validLogin'
    })
    .then(function(result) {
      cb(result);
    });
  };

  var fetchRooms = function(cb) {
    return $http({
      method: 'GET',
      url: '/lobby'
    })
    .then(function (rooms) {
      cb(rooms);
    });
  };

  var logoutUser = function() {
    return $http({
      method: 'POST',
      url: '/logout'
    })
    .then(function() {
      console.log('SUCCESSFULLY LOGGED OUT');
    });
  };

  var insertUser = function(username, user, roomName, cb) {
    return $http({
      method: 'PUT',
      url: '/lobby',
      data: JSON.stringify({
        chatroomName: roomName,
        username: username,
        user: user
      })
    })
    .then(function (updatedRoom) {
      cb(updatedRoom);
    });
  };


  return {
    validateUser: validateUser,
    fetchRooms: fetchRooms,
    logoutUser: logoutUser,
    insertUser: insertUser
  };
});