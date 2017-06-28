angular.module("researchApp", ['ui.router','ngCookies'])

    .run(function($rootScope, $cookies){
        if($cookies.get('token') && $cookies.get('currentUser')){
            $rootScope.token = $cookies.get('token');
            $rootScope.currentUser = $cookies.get('currentUser');
        }
    })

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

            .state('app.user_home', {
                url:'user_home',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html'
                    },
                    'content@': {
                        templateUrl : 'views/user_home.html',
                        controller  : 'UserHomeController'
                    }
                    
                }
            })
		$urlRouterProvider.otherwise('/');
	        

	})


	;


