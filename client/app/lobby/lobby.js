var lobby = angular.module('argue.lobby', []);
var lobbySocket = io('/lobby');

///////////////////////////////////////////////////////////
// Lobby Controller
///////////////////////////////////////////////////////////
lobby.controller('lobbyController', function($scope, $location, Lobby, Chatroom) {
  Lobby.validateUser(function(result) {
    $scope.myuser = result.data;
  }).then(function() {
    if ($scope.myuser !== '') {
      $scope.allRooms = {
        rooms: []
      };

      $scope.fetchRooms = function() {
        Lobby.fetchRooms(function(rooms) {
          $scope.allRooms.rooms = rooms.data;
        });
      };

      $scope.fetchRooms();

      ///////////////////////////////////////////////////////////
      // Socket.io event listeners
      ///////////////////////////////////////////////////////////
      // Remove all listeners on socket
      socket.removeAllListeners();

      // Listen for when someone enters a room
      lobbySocket.on('other user enters room', function(username, user, roomName){
        $scope.fetchRooms();
      });

      // Listen for when someone leaves a room
      lobbySocket.on('other user leaves room', function(username){
        $scope.fetchRooms();
      });      
      ///////////////////////////////////////////////////////////

      $scope.insertUser = function(index, user, roomName) {

        Lobby.insertUser($scope.myuser, user, roomName, function(updated) {
          lobbySocket.emit('user enters room', $scope.myuser, user, roomName);
          Chatroom.currRoom = roomName;
          $location.path('/chatroom');
        });
      };

      $scope.redirectToToken = function(path) {
        $location.path('/token');
      };

      $scope.logout = function(path) {
        // Destroy session
        Lobby.logoutUser();
        $location.path('/login');
      };
    } else {
      $location.path('/login');
    }
  });

});
