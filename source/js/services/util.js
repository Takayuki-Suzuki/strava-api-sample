(function(){
	'use strict';

	angular.module('StravaApp')
	.factory('Util', ['$http', '$rootScope', function ($http, $rootScope) {
		$rootScope.alerts = [];
		return {
			addAlert: function(msg, type) {
		        $rootScope.alerts.push({msg: msg, type: type});
		    },
		    closeAlert: function(index) {
		        $rootScope.alerts.splice(index, 1);
		    },
		    closeAllAlert: function() {
		        $rootScope.alerts = [];
		    }
		}
	}]);
})();