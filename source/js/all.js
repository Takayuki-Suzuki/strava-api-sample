(function(){
	'use strict';

	angular.module('StravaApp', [
	  'ngCookies',
	  'ngResource',
	  'ui.router',
	  'ui.bootstrap',
	  'ncy-angular-breadcrumb'
	])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		// $httpProvider.defaults.withCredentials = true;
		// $httpProvider.interceptors.push('AuthInterceptor');
		$urlRouterProvider
		.otherwise('/');

		$stateProvider
		.state('root', {
			abstract: true,
			template: '<div ui-view></div>',
    		resolve: {
    			constants: function (ConstantsService) {
      				return ConstantsService.getConstants();
	    		},
	    		currentUser: function($cookies, Auth){
	    			return Auth.getCurrentUserAsync();
	    		}
	    	}
		})
		.state('login', { 
			parent: 'root',
	        url: "/login",
	        templateUrl: 'views/login/login.html',
	        controller: 'LoginCtrl',
	        noNeedForLoggedInUser: true
		})
		.state('login_callback', { 
			parent: 'root',
	        url: "/login_callback",
	        templateUrl: 'views/top.html',
	        controller: 'LoginCallbackCtrl',
	        noNeedForLoggedInUser: true
		})
		.state('logout', { 
			parent: 'root',
	        url: "/logout",
	        controller: 'LogoutCtrl',
	        requireLogin: true
	    })
		.state('top', {
			parent: 'root',
			url: '/',
			templateUrl: 'views/top.html',
			controller: 'TopCtrl',
			requireLogin: true,
			resolve: {
				activities: function($http){
					return $http.get('/activities?page=1&per_page=20');
				}
			}
		})
		// .state('activities', {
		// 	parent: 'root',
		// 	url: '/',
		// 	templateUrl: 'views/activites/new.html',
		// 	controller: 'NewActivitiesCtrl',
		// 	requireLogin: true,
		// 	resolve: {
		// 		activities: function($http){
		// 			return $http.get('/activities');
		// 		}
		// 	}
		// });
		.state('new_activities', {
			parent: 'root',
			url: '/new_activities',
			templateUrl: 'views/activities/new.html',
			controller: 'NewActivitiesCtrl',
			requireLogin: true
		});
		$locationProvider.html5Mode(true);
	}])

	.run(['$rootScope', '$location', '$state', '$urlRouter', 'Auth', function ($rootScope, $location, $state, $urlRouter, Auth) {
		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
			Auth.isLoggedInAsync(function(isLoggedIn){
        		if(toState.requireLogin && !isLoggedIn){
	        		e.preventDefault();
	        		$state.go('login');
	        	}
	        	if(toState.noNeedForLoggedInUser && isLoggedIn){
	        		e.preventDefault();
	        		$state.go('top');
	        	}
        	});
	    });
	    $rootScope.$on('$stateChangeSuccess',function(event, toState){

	   	});
	}])
	// .constant('globals', );
})();