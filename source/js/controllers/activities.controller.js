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
	.controller('ShowActivitiesCtrl', ['$scope', '$http', '$state', '$q', 'Util', 'activities', function($scope, $http, $state, $q, Util, activities){
		$scope.types = ['time', 'altitude', 'heartrate', 'cadence', 'watts'];
		$scope.activities = activities.data;
		$scope.params = $state.params;
		$scope.streams = {};

		$scope.getActivities = function(per_page){
			var defer = $q.defer();
			$http.get('/activities?page=' + $scope.page + '&per_page=' + per_page)
			.success(function(activities){
				$scope.activities = _.uniq(_.union($scope.activities, activities));
				$scope.page++;
				defer.resolve(activities.length < per_page);
			})
			.error(function(data, status){
				Util.addAlert('Error!' + data.error, 'danger');
				defer.reject();
			});
			return defer.promise;
		};

		$scope.getStreams = function(type){
			return $http.get('/activities/' + $state.params.id + '/streams/' + type)
			.success(function(data, status){
				$scope.streams[type] = data;
			})
			.error(function(data, status){
				Util.addAlert('Error!' + data.error, 'danger');
			});
		};

		$http.get('/activities/' + $state.params.id)
		.success(function(data, status){
			$scope.activity = data;
		})
		.error(function(data, status){
			Util.addAlert('Error!' + data.error, 'danger');
		});

		var createData = function(){
			var data = [];
			$scope.types.forEach(function(type){
				// console.log(_.where($scope.streams[type], {type: type})[0].data);
				data.push(_.where($scope.streams[type], {type: type})[0].data);
			});
			// console.log(data);
			return data;
		}

		var queues = [];
		// stream
		$scope.types.forEach(function(type){
			queues.push($scope.getStreams(type));
		});
		
		$q.all(queues).then(function(){
			console.log(_.where($scope.streams.time, {type: 'distance'})[0].data);
			$scope.labels = _.where($scope.streams.time, {type: 'distance'})[0].data;
			$scope.data = createData();
			// console.log('done');
		})

		
		
		
		

		$scope.onClick = function (points, evt) {
			console.log(points, evt);
		};
	}])
})();