var services = angular.module('argue.token.service', []);

services.factory('Token', function($http) {
  var validateUser = function(cb) {
    return $http({
      method: 'GET',
      url: '/validLogin'
    })
    .then(function(result) {
      cb(result);
    });
  };

  var grabAllBattles = function(cb) {
    return $http({
      method: 'GET',
      url: '/token'
    })
    .then(function(result) {
      cb(result.data);
    });
  };

  return {
    validateUser: validateUser,
    grabAllBattles: grabAllBattles
  };
});
