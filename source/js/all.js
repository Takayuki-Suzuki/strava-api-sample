(function(){
	'use strict';

	angular.module('StravaApp', [
	  'ngCookies',
	  'ngResource',
	  'ui.router',
	  'ui.bootstrap',
	  'ncy-angular-breadcrumb'
	])
	  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
	    $httpProvider.defaults.withCredentials = true;
	    $urlRouterProvider
	      .otherwise('/');

	      $stateProvider
	      		.state('login', { 
	                url: "/login",
	                templateUrl: 'views/login/login.html',
	                controller: 'LoginCtrl',
	                noNeedForLoggedInUser: true
	              })
	      		.state('logout', { 
	                url: "/logout",
	                controller: 'LogoutCtrl',
	                requireLogin: true
	             })
	      		.state('top', {
					url: '/',
					templateUrl: 'views/top.html',
					controller: 'TopCtrl',
					requireLogin: true
				});
	  }])

		.run(["$rootScope", "$location", "$state", "$urlRouter", function ($rootScope, $location, $state, $urlRouter) {
			$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){

		    });
		    $rootScope.$on('$stateChangeSuccess',function(event, toState){

		   	});
		}]);
	})();