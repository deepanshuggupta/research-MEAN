angular.module("researchApp", ['ui.router','ngCookies'])

    .run(function($rootScope, $cookies){
        if($cookies.get('token') ){
            $rootScope.token = $cookies.get('token');
            
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

            .state('app.signup', {
                url:'signup',
                views: {
                    'content@': {
                        templateUrl : 'views/signup.html',
                        controller  : 'SignupController'
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
	        
	        
	        
	        .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html'
                        //controller  : 'SignOutController'
                     }
                }
            })

            .state('app.user_home', {
                url:'user_home',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'SignOutController'
                    },
                    'content@': {
                        templateUrl : 'views/user_home.html',
                        controller  : 'UserHomeController'
                    }
                    
                }
            })

            .state('app.user_dashboard', {
                url:'user_dashboard',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html'
                    },
                    'content@': {
                        templateUrl : 'views/user_dashboard.html',
                        controller  : 'UserDashboardController'
                     }
                }
            })
            .state('app.edit_profile', {
                url:'edit_profile',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html'
                    },
                    'content@': {
                        templateUrl : 'views/edit_profile.html'
                        //controller  : 'ContactController'
                     }
                }
            })
            .state('app.publisher_home', {
                url:'publisher_home',
                views: {
                    'header@': {
                        templateUrl : 'views/header3.html',
                        controller  : 'SignOutController'
                    },
                    'content@': {
                        templateUrl : 'views/publisher_home.html',
                        controller  : 'PublisherHomeController'
                    }
                    
                }
            })

            .state('app.publisher_dashboard', {
                url:'publisher_dashboard',
                views: {
                    'header@': {
                        templateUrl : 'views/header3.html'
                    },
                    'content@': {
                        templateUrl : 'views/publisher_dashboard.html',
                        controller  : 'PublisherDashboardController'
                     }
                }
            })
            .state('app.publisher_edit_profile', {
                url:'publisher_edit_profile',
                views: {
                    'header@': {
                        templateUrl : 'views/header3.html'
                    },
                    'content@': {
                        templateUrl : 'views/publisher_edit_profile.html',
                        controller  : 'PublisherEditController'
                     }
                }
            })
            .state('app.submit', {
                url:'submit',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html'
                    },
                    'content@': {
                        templateUrl : 'views/submit.html',
                        controller  : 'ApplicationSubmitController'
                     }
                }
            })
            .state('app.application', {
                url:'application',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html'
                    },
                    'content@': {
                        templateUrl : 'views/application.html',
                        controller  : 'ApplicationController'
                     }
                }
            })
		$urlRouterProvider.otherwise('/');
	        

	})


	;


