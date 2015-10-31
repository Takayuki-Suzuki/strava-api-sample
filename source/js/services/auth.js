(function(){
	'use strict';

	angular.module('StravaApp')
	.factory('Auth', ['$http', '$q', '$rootScope', '$cookies', function ($http, $q, $rootScope, $cookies) {
		var currentUser = {};
		var defer = $q.defer();

		if(!$cookies.get('access_token')){
			defer.resolve({});
		} else {
			console.log('Bearer ' + $cookies.get('access_token'));
			$http({
				method: 'GET',
				url: 'https://www.strava.com/api/v3/athlete',
				headers: {'Authorization': 'Bearer ' + $cookies.get('access_token')}
			})
	        .success(function(data) {
		     	currentUser = data;
		      	defer.resolve(currentUser);
		    })
		    .error(function(data){
		    	defer.resolve({});
		    	console.log(data);
		    });	
		}

		return {
			defer: defer,
		    getCurrentUser: function(cb) {
		        defer.promise.then(function(){
		    		cb(currentUser);
		    	}).catch(function(){
		    		cb(null);
		    	});
		    },
		    isLoggedIn: function(cb){
		    	defer.promise.then(function(){
		    		cb(currentUser.hasOwnProperty('id'));
		    	}).catch(function(){
		    		cb(false);
		    	});
		    }
		}
	}]);
})();