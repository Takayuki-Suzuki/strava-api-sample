(function(){
	'use strict';

	angular.module('StravaApp', [
	  'ngCookies',
	  'ngResource',
	  'ui.router',
	  'ui.bootstrap',
	  'nvd3',
	  'ncy-angular-breadcrumb'
	])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		// $httpProvider.defaults.withCredentials = true;
		// $httpProvider.interceptors.push('AuthInterceptor');
		$urlRouterProvider
		.otherwise('/activities');

		$stateProvider
		.state('root', {
			abstract: true,
			template: '<div ui-view></div>',
    		resolve: {
    			constants: function (ConstantsService) {
      				return ConstantsService.getConstants();
	    		}
	    		//,
	    		// currentUser: function($cookies, Auth){
	    		// 	return Auth.getCurrentUserAsync();
	    		// }
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
			url: '/activities',
			templateUrl: 'views/top.html',
			controller: 'TopCtrl',
			requireLogin: true,
			resolve: {
				activities: function($http, Auth){
					return $http.get('/activities?page=1&per_page=20');
				}
			}
		})
		.state('new_activities', {
			parent: 'top',
			url: '/new',
			templateUrl: 'views/activities/new.html',
			controller: 'NewActivitiesCtrl',
			requireLogin: true
		})
		.state('show_activities_layout', {
			parent: 'top',
			abstract: true,
			templateUrl: 'views/activities/layout.html',
		})
		.state('show_activities', {
			parent: 'show_activities_layout',
			url: '/:id',
			templateUrl: 'views/activities/show.html',
			controller: 'ShowActivitiesCtrl',
			requireLogin: true
		});
		// $locationProvider.html5Mode(true);
	}])

	.run(['$rootScope', '$location', '$state', '$urlRouter', '$anchorScroll', 'Auth', function ($rootScope, $location, $state, $urlRouter, $anchorScroll, Auth) {
		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
			// console.log(Auth);
			Auth.isLoggedInAsync(function(isLoggedIn){
				// console.log(toState.requireLogin);
				if(toState.requireLogin && !isLoggedIn){
	        		e.preventDefault();
	        		$state.go('login');
	        	}
	        	if(toState.noNeedForLoggedInUser && isLoggedIn){
	        		e.preventDefault();
	        		$state.go('top');
	        	}
			})
	    });
	    $rootScope.$on('$stateChangeSuccess',function(event, toState){
	    	$rootScope.controller = toState.controller;
	    	$anchorScroll();
	   	});
	}])
	// .constant('globals', );
})();