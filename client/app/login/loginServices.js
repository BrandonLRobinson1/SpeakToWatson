var services = angular.module('argue.login.service', []);

services.factory('Logins', function($http) {
  var postUsername = function(username) {
    console.log('postUsername fired. this is username',username)//this got invoked. 
    return $http({
      method: 'POST',
      url: '/users',
      data: username,
      
    })
    .then(function (resp) {
      console.log('postUsername response returned!',resp)
      return resp;
    });
  };

  return {
    postUsername: postUsername
  };
});