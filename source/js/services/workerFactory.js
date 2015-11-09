(function(){
	'use strict';

	angular.module('StravaApp')
	.factory('Worker', [function () {
		return new Worker('/js/worker.js');
	}]);
})();