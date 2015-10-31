(function(){
    'use strict';
    angular.module('StravaApp')
      .controller('MainCtrl', ['$scope', 'Auth', function ($scope, Auth) {
        $scope.currentUser = Auth.getCurrentUser();
      }]);
})();