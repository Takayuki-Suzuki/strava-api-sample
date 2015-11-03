(function(){
	'use strict';

	angular.module('StravaApp')
	.factory('Auth', ['$http', '$q', '$rootScope', '$cookies', function ($http, $q, $rootScope, $cookies) {
		var currentUser;
		var defer = $q.defer();

		var isLoggedIn = function(){
	    	return !!currentUser && currentUser.hasOwnProperty('id');
	    };
		// currentUser.$promise = defer.promise;
		$http.get('/getCurrentUser')
        .success(function(result) {
        	currentUser = result.data;
        	defer.resolve(currentUser);
	      	// if(cb) cb(result.data);
	    })
	    .error(function(data, status){
	    	currentUser = null;
	    	defer.resolve(currentUser);
	    	// if(cb) cb(null);
	    });



		return {
			defer: defer,
			// getCurrentUserAsync: function(cb) {
		 //        return 	
		 //    	// return defer.promise;
		 //    },
		    getCurrentUser: function(){
		    	return currentUser;
		    },
		    isLoggedInAsync: function(cb){
		    	defer.promise.then(function(user){
		    		cb(isLoggedIn());
		    	});
		    },
		    isLoggedIn: isLoggedIn,
		    logout: function(){
		    	currentUser = null;
		    }
		}
	}]);
})();