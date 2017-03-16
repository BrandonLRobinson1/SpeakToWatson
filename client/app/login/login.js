var login = angular.module('argue.login', []);


login.controller('loginController', function($scope, $location, Logins) {
  $scope.data = {};
  $scope.submitUsername = function() {
    $scope.data.username = $scope.username;
    $scope.data.password = null;
    $scope.data.imageUrl = null;
    Logins.postUsername($scope.data);
    $location.path('/lobby');
  };
});
