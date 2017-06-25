angular.module("researchApp", ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {

	    $stateProvider

	    	.state('/', {
	            url: '/',
	            templateUrl: 'home.html',
	            controller: 'HomeController'
	        })
	        // HOME STATES AND NESTED VIEWS ========================================
	        
	        
	        .state('login', {
	            url: '/login',
	            templateUrl: 'login.html',
	            controller: 'LoginController' 
	        })

	        .state('signup', {
	            url: '/signup',
	            templateUrl: 'signup.html',
	            controller: 'SignupController'
	        })

	        .state('contactus', {
	            url: '/contactus',
	            templateUrl: 'contactus.html'
	        });
	        

	})


	;




