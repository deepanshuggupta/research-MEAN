angular.module("researchApp", ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {

	    $stateProvider

	    		        // HOME STATES AND NESTED VIEWS ========================================
	        .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
            })


            .state('app.login', {
                url:'login',
                views: {
                	'content@': {
                        templateUrl : 'views/login.html',
                        controller  : 'LoginController'
                     }
                }
            })
	        
	        .state('app.signup', {
                url:'signup',
                views: {
                    'content@': {
                        templateUrl : 'views/signup.html',
                        controller  : 'SignupController'
                     }
                }
            })
	        
	        .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html'
                        //controller  : 'ContactController'
                     }
                }
            })
		$urlRouterProvider.otherwise('/');
	        

	})


	;


