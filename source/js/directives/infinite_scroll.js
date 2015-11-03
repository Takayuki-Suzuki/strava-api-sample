(function(){
	'use strict';

	angular.module('StravaApp')
	.directive('infiniteScroll', ['$window', function($window){
		return {
			restrict: 'A',

			link: function(scope, element, attrs, controller) {
				scope.retrieving = false;
				scope.isFinished = false;
				element.append('<tr id="infinite-scroll-trigger"><td colspan="100" style="text-align:center;cursor:pointer">Show more</td></tr>');

				var $trigger = element.find('#infinite-scroll-trigger');

				var fetch = function(){
					$trigger.hide();
					scope.retrieving = true;
						element.append('<tr id="infinite-scroll-loading"><td colspan="100" style="text-align:center;"><i class="fa fa-spinner fa-spin"></i> Loading...</td></tr>');
						scope[attrs.onScroll](attrs.perPage)
						.then(function(isFinished){

							scope.retrieving = false;
							scope.isFinished = isFinished;
							scope.isFinished || $trigger.show();
							element.find('#infinite-scroll-loading').remove();
						});
				};

				$($window).on('scroll', function(e){
					if($($window).scrollTop() < 10 || scope.isFinished || element.is(':hidden')) return;
					if( !scope.retrieving &&
						$($window).scrollTop() + $($window).height() > element.offset().top + element.height() + 10){
						fetch();
					}
				});
				$trigger.on('click', function(){
					fetch();
				});

			}
			// template: '{{element}}'
		}
	}]);
})();