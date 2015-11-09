importScripts('/bower_components/lodash/lodash.min.js');

onmessage = function(e) {
  	postMessage(createData(e.data));
};

var createData = function($scope){
	// console.time('timer1');
	var editedData = {};
	
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
		// console.log(values.length);
	});
	// console.timeEnd('timer1');
	return editedData;
};