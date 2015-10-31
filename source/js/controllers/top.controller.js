(function(){
	'use strict';
	
	angular.module('StravaApp').controller('TopCtrl', ['$scope', 'constants', function($scope, constants){
		$scope.test = constants;
	}]);
})();