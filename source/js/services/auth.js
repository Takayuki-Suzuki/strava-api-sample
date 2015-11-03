(function(){
	'use strict';

	angular.module('StravaApp')
	.factory('Auth', ['$http', '$q', '$rootScope', '$cookies', function ($http, $q, $rootScope, $cookies) {
		var currentUser;
		var defer = $q.defer();

		return {
			defer: defer,
			getCurrentUserAsync: function(cb) {
		        $http.get('/athletes/')
		        .success(function(data, status) {
		        	currentUser = data;
			      	defer.resolve(data);
			      	if(cb) cb(data);
			    })
			    .error(function(data, status){
			    	defer.resolve();
			    	if(cb) cb(null);
			    });	
		    	return defer.promise;
		    },
		    getCurrentUser: function(){
		    	return currentUser;
		    },
		    isLoggedInAsync: function(cb){
		    	defer.promise.then(function(currentUser){
		    		cb(currentUser && currentUser.hasOwnProperty('id'));
		    	}).catch(function(){
		    		cb(false);
		    	});
		    	return defer.promise;
		    },
		    isLoggedIn: function(){
		    	return currentUser && currentUser.hasOwnProperty('id');
		    },
		    logout: function(){
		    	currentUser = null;
		    	defer = $q.defer();
		    }
		}
	}]);
})();