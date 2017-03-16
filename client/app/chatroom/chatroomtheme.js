var chatroomtheme = angular.module('argue.chatroomtheme', [])

chatroomtheme.controller('chatroomthemeController', function($scope) {
  $scope.css = 'cosmo';

  $scope.bootstraps = [
    { name: 'Basic', url: 'cosmo' },
    { name: 'Slate', url: 'slate' },
    { name: 'Sandstone', url: 'sandstone' }
  ];

  $scope.layout = 'normal';

  $scope.layouts  = []
    { name: 'Boring', url: 'normal' },
    { name: 'Circles', url: 'circle' },
    { name: 'In Your Face', url: 'large' }
  ];
});