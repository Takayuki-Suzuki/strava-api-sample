(function(){
	'use strict';
	angular.module('StravaApp')
	.service('ConstantsService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
		var staticConstants = {
			PER_PAGE: 20
		}
		return {
			getConstants: function() {
				var defer = $q.defer();
				$http.get('/getSettings')
      			.success(function(constants){
      				// $rootScope.constants = _.extend(constants, staticConstants);
      				defer.resolve(_.extend(constants, staticConstants));
      			})
      			.error(function(data){
      				defer.reject();
      			});
				return defer.promise;
			}
		}
	}]);
})();