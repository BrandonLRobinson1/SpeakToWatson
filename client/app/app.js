angular.module('argue', [
    'argue.services',
    'argue.login',
    'argue.chatroom',
    'argue.token',
    'argue.lobby',
    'ngRoute'
  ])
  .config(function($routeProvider, $httpProvider) {
    $routeProvider
    .when('/login', {
      templateUrl: 'app/login/login.html',
      controller: 'loginController'
    })
    .when('/lobby', {
      templateUrl: 'app/lobby/lobby.html',
      controller: 'lobbyController'
    })
    .when('/chatroom', {
      templateUrl: 'app/chatroom/chatroom.html',
      controller: 'chatroomController'
    })
    .when('/token', {
      templateUrl: 'app/token/token.html',
      controller: 'tokenController'
    })
    .otherwise({redirectTo: '/login'});
  });

  