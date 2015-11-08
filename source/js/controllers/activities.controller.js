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
					setTimeout(function(){
						$state.go('top', {}, {reload: true}).then(function(){
							$scope.proccessing = false;
							Util.addAlert('FIT file has successfully uploaded!', 'success');
						});
					}, 3000);
					
					// console.log(data, status);
				})
				.error(function(data, status){
					Util.addAlert('Error!' + data.error, 'danger');
					$scope.proccessing = false;
					// console.log(data, status);
				});
			}
		};
	}])
	.controller('ShowActivitiesLayoutCtrl', ['$scope', '$state', function($scope, $state){
		$scope.layout = {};
		$scope.layout.params = $state.params;
	}])
	.controller('ShowActivitiesCtrl', ['$scope', '$http', '$state', '$q', '$filter', 'Util', 'activities', function($scope, $http, $state, $q, $filter, Util, activities){
		$scope.types = {
			time: ['distance', 'altitude', 'heartrate', 'cadence', 'watts'],
			distance: ['time', 'altitude', 'heartrate', 'cadence', 'watts']
		};
		$scope.activities = activities.data;
		$scope.params = $scope.layout.params = $state.params;
		$scope.streams = {};
		$scope.seriesType = 'time';
		$scope.data = {};
		$scope.loading = false;

		$scope.changeSeriesType = function(seriesType){
			$scope.seriesType = seriesType;
		}

		var init = function(){
			$scope.$watch('seriesType', function(){
		    	$scope.updateData();
		    });
		};

		$scope.updateData = function(){
			var queues = [];

			$scope.loading = true;

			$http.get('/activities/' + $state.params.id)
			.success(function(data, status){
				$scope.activity = data;
			})
			.error(function(data, status){
				Util.addAlert('Error!' + data.error, 'danger');
			});

			$scope.types[$scope.seriesType].forEach(function(type){
				queues.push(getStreams(type));
			});
			
			return $q.all(queues).then(function(){
				$scope.loading = false;
				$scope.data = $scope.createData();
				$scope.options = getOptions();
			});
		}

		var getStreams = function(type){
			return $http.get('/activities/' + $state.params.id + '/streams/' + type + '?seriesType=' + $scope.seriesType)
			.success(function(data, status){
				$scope.streams[type] = data;
				// console.log(data);
			})
			.error(function(data, status){
				Util.addAlert('Error!' + data.error, 'danger');
			});
		};

		var getOptions = function(){
			var options = [];
			_.each($scope.types[$scope.seriesType], function(type, i){
				options.push(getOption(type, i));
			});
			return options;
		}

		var getOption =  function(type, num){
	        return {
	            	chart: {
	                type: 'lineChart',
	                height: 150,
	                margin : {
	                    top: 20,
	                    right: 20,
	                    bottom: 50,
	                    left: 65
	                },
	                x: function(d){ return d[0]; },
	                y: function(d){ return d[1]; },

	                color: [d3.scale.category10().range()[num]],
	                duration: 300,
	                useInteractiveGuideline: true,
	                clipVoronoi: false,
	                // dispatch: {
	                //     stateChange: function(e){ console.log("stateChange"); },
	                //     changeState: function(e){ console.log("changeState"); },
	                //     tooltipShow: function(e){ console.log("tooltipShow"); },
	                //     tooltipHide: function(e){ console.log("tooltipHide"); }
	                // },

	                xAxis: {
	                    axisLabel: $scope.seriesType,
	                    tickFormat: function(d) {
	                    	if($scope.seriesType === 'time'){
	                    		return $filter('time')(d);
	                    	} else {
	                    		return d;
	                    	}
	                        
	                    },
	                    showMaxMin: false,
	                    staggerLabels: true,
	                    axisLabelDistance: 10
	                },

	                yAxis: {
	                    axisLabel: type,
	                    axisLabelDistance: 0
	                }
	            }
	        };
	    };

	    $scope.createData = function(){
			var editedData = {};
			console.time('timer1');
			$scope.types[$scope.seriesType].forEach(function(type){
				var dataContainer = _.where($scope.streams[type], {type: type})[0]; 
				if(!dataContainer) return editedData;
				var seriesType = _.where($scope.streams[type], {type: $scope.seriesType})[0].data;
				var dataArray = dataContainer.data;
				var values = [];
				_.each(dataArray, function(data, i){
					values.push([seriesType[i], data]);
				});
				editedData[type] = [{
					key: type,
					values: values
				}];
			});
			console.timeEnd('timer1');
			return editedData;
		};

		$scope.getActivities = function(per_page){
			per_page = per_page ? per_page : constants.PER_PAGE;
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
		$scope.options = getOptions();

		init();
	}])
})();