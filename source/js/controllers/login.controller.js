(function(){
	'use strict';
	angular.module('StravaApp')
	.controller('LoginCtrl', ['$scope', '$http', 'constants', function($scope, $http, constants){
		$scope.constants = constants;
	}])
	.controller('LoginCallbackCtrl', ['$scope', '$http', '$state', '$location', 'constants', function($scope, $http, $state, $location, constants){
		// $scope.code = $location.search().code;
		// $scope.tokenExchange = function(){
			// console.log($state.params);
			// console.log($location.search());
		// $http({
		// 	method : 'POST',
		// 	url : 'https://www.strava.com/oauth/token',
		// 	headers: {'Authorization': 'Bearer'},
		// 	data: $.param({
		// 		client_id: constants.CLIENT_ID,
		// 		client_secret: constants.CLIENT_SECRET,
		// 		code: $location.search().code
		// 	}),
		// 	withCredentails: true,
		// 	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		// })
		// .success(function(data){
		// 	console.log('success', data);
		// })
		// .error(function(data){
		// 	console.log('error', data);
		// })
		// }
	}]);
	;
})();