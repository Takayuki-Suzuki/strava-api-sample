(function(){
    'use strict';
    angular.module('StravaApp')
      .controller('MainCtrl', ['$scope', 'Auth', 'Util', function ($scope, Auth, Util) {
        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.addAlert = Util.addAlert;
	    $scope.closeAlert = Util.closeAlert;
	    $scope.closeAllAlert = Util.closeAllAlert;
      }]);
})();