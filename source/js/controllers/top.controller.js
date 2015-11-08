(function(){
	'use strict';
	
	angular.module('StravaApp').controller('TopCtrl', ['$scope', '$q', '$http', 'activities', 'constants', function($scope, $q, $http, activities, constants){
		$scope.activities = activities.data;
		$scope.page = 2;

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
		}
	}]);
})();