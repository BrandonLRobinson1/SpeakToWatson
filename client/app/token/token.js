var token = angular.module('argue.token', []);


token.controller('tokenController', function($scope, $location, Token, Lobby, Chatroom) {
  Token.validateUser(function(result) {
    $scope.myuser = result.data;
  }).then(function() {
    if ($scope.myuser !== '') {

      $scope.data = {sessions: {}};

      Token.grabAllBattles(function(result) {
        result.forEach(function(battle) {
          if (!$scope.data.sessions[battle.session]) {
            $scope.data.sessions[battle.session] = [battle.session, battle.chatroom, battle.opponent];
            $scope.data.sessions[battle.session].push(battle);
          } else {
            $scope.data.sessions[battle.session].push(battle);
          }
        });
      });

      $scope.leaveRoom = function() {
        $location.path('/lobby');
      };

      $scope.chatroom = Chatroom.currRoom;
      $scope.opponent = Chatroom.opponent;

    } else {
      $location.path('/login');
    }
  });
});
