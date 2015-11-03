(function(){
	'use strict';

	angular.module('StravaApp')
	.filter('time', function() {
	  return function(seconds) {
	  	var array = [];
	    var seconds = seconds;
	    var hours = Math.floor(seconds / 3600);
	    var minutes = Math.floor((seconds % 3600) / 60);
	    var seconds = Math.floor(seconds % 60);

	    array.push(hours);
	    minutes < 10 ? array.push('0' + minutes) : array.push(minutes);
	    seconds < 10 ? array.push('0' + seconds) : array.push(seconds);
	    return array.join(' : ');
	}
	});
})();