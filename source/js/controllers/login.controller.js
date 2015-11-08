(function(){
	'use strict';
	angular.module('StravaApp')
	.controller('LoginCtrl', ['$scope', '$http', 'constants', function($scope, $http, constants){
		$scope.constants = constants;
	}])
	.controller('LoginCallbackCtrl', ['$scope', '$http', '$state', '$location', 'Auth', function($scope, $http, $state, $location, Auth){

	}])
	.controller('LogoutCtrl', ['$http', '$state', 'Auth', function($http, $state, Auth){
		Auth.logout();
		$http({
			method : 'POST',
			url : '/logout'
		})
		.success(function(data, status){
			// console.log('success', data);
			$state.go('top', {}, {reload: true})
		})
		.error(function(data, status){
			// console.log('error', data);
			$state.go('top', {}, {reload: true})
		})
	}]);
})();