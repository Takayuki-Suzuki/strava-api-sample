(function(){
	'use strict';
	angular.module('StravaApp')
	.service('ConstantsService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
		return {
			getConstants: function() {
				var defer = $q.defer();
				$http.get('/getSettings')
      			.success(function(constants){
      				$rootScope.constants = constants
      				defer.resolve(constants);
      			})
      			.error(function(data){
      				defer.reject();
      			});
				return defer.promise;
			}
		}
	}]);
})();