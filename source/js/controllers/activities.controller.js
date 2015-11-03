(function(){
	'use strict';

	angular.module('StravaApp')
	.controller('NewActivitiesCtrl', ['$scope', '$http', '$state', 'Util', function($scope, $http, $state, Util){
		$scope.activity_types = [
			'ride',
			'run', 
			'swim', 
			'workout', 
			'hike', 
			'walk', 
			'nordicski', 
			'alpineski', 
			'backcountryski', 
			'iceskate', 
			'inlineskate', 
			'kitesurf', 
			'rollerski', 
			'windsurf',
			'snowboard', 
			'snowshoe', 
			'ebikeride', 
			'virtualride' 
		];
		$scope.fit = "";
		$scope.activity_type = "";
		$scope.proccessing = false;
		$scope.uploads = function(){
			if($scope.form.$valid){
				$scope.proccessing = true;
				var formData = new FormData();
				formData.append('fit', $scope.fit);
				formData.append('activity_type', $scope.activity_type);
				$http.post('/uploads', formData, {
		            transformRequest: null,
		            headers: {'Content-type':undefined}
		        })
				.success(function(data, status){
					$state.go('top', {}, {reload: true}).then(function(){
						Util.addAlert('FIT file has successfully uploaded!', 'success');
					});
					$scope.proccessing = false;
					console.log(data, status);
				})
				.error(function(data, status){
					Util.addAlert('Error!' + data.error, 'danger');
					$scope.proccessing = false;
					console.log(data, status);
				});
			}
		};
	}])
})();