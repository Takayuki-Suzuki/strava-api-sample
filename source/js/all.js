(function(){
	'use strict';

	angular.module('StravaApp', [
	  'ngCookies',
	  'ui.router',
	  'ui.bootstrap',
	  'nvd3',
	  'ncy-angular-breadcrumb'
	])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		$urlRouterProvider
		.otherwise('/activities');

		$stateProvider
		.state('root', {
			abstract: true,
			template: '<div ui-view></div>',
    		resolve: {
    			constants: ['ConstantsService', function (ConstantsService) {
      				return ConstantsService.getConstants();
	    		}]
	    	}
		})
		.state('login', { 
			parent: 'root',
	        url: "/login",
	        templateUrl: 'views/login/login.html',
	        controller: 'LoginCtrl',
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
				activities: ['$http', 'Auth', 'constants', 'Util', function($http, Auth, constants, Util){
					return $http.get('/activities?page=1&per_page=' + constants.PER_PAGE)
					.error(function(data, status){
						//Util.addAlert('Error!' + data.error, 'danger');
					});;
				}]
			}
		})
		.state('new_activities', {
			parent: 'top',
			url: '/new',
			templateUrl: 'views/activities/new.html',
			controller: 'NewActivitiesCtrl',
			requireLogin: true,
			ncyBreadcrumb: {
				label: 'Upload FIT file'
			},
		})
		.state('show_activities_layout', {
			parent: 'top',
			abstract: true,
			templateUrl: 'views/activities/layout.html',
			controller: 'ShowActivitiesLayoutCtrl'
		})
		.state('show_activities', {
			parent: 'show_activities_layout',
			url: '/:id',
			templateUrl: 'views/activities/show.html',
			controller: 'ShowActivitiesCtrl',
			requireLogin: true,
			ncyBreadcrumb: {
				label: '{{activity.name}} Detail'
			}
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
})();