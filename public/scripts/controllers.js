angular.module("researchApp")
	

	.controller("HomeController", ['$scope', '$http',function ($scope, $http){
		$http.get('/featuredPublishers')
			.then(function(res){
					$scope.featuredPublishers = res.data;
			});
	}])

	.controller("SignupController", ['$rootScope','$scope','$http','$location', function($rootScope,$scope,$http, $location){
		$rootScope.showError = false;
		$rootScope.showMessage = false;
		$rootScope.destmessage = '';
		$scope.signup = function(){
			var newUser = {
				'firstName': $scope.firstName,
				'lastName': $scope.lastName,
				'userEmail': $scope.userEmail,
				'userPassword': $scope.userPassword,
				'role': $scope.role
				
			};
			
			console.log(newUser);
			$http.post('/signup', newUser)
				.then(function(res){
					//console.log(res.data);
					if(res.data){
						console.log("you can login now");
						alert('Congratulation, you are successfully registered');
						$location.path('login');
					}
					else{
						$rootScope.showError = true;
						$rootScope.error_message = 'Email alredy Present';
						console.log("you cannot login now");	
						
						$location.path('signup');
					}
				})
			
		}
	}])

	.controller("LoginController", ['$rootScope','$scope', '$http','$cookies','$location', function($rootScope,$scope, $http, $cookies, $location){
		$scope.user = {};
		$rootScope.loginMessageDisplay = false;
		$scope.login = function(){
			$scope.user = {
				'userEmail': $scope.userEmail,
				'userPassword': $scope.userPassword,
				'role': $scope.role,
				'isRemember': $scope.isRemember
			};
			//console.log($scope.user);
			if($scope.user.role == "Publisher"){
				//console.log("publisher login");
				$http.post('/loginPublisher', $scope.user).then(function(res){
					if(res.data.token){
						//console.log(res.data.token);
						$cookies.put('token', res.data.token);
						$cookies.put('currentUser', $scope.user.userEmail);
						$rootScope.token = res.data.token;
						$rootScope.currentUser = $scope.user.userEmail;
						//console.log(currentUser);
						$location.path('publisher_home');
					}
						
					else{
						$rootScope.loginMessageDisplay = true;
						$rootScope.showMessage = false;
						$location.path('login');	
					}
				});
			}
			else{
				//console.log("Author login");
				$http.post('/loginAuthor',  $scope.user).then(function(res){
					if(res.data.token){
						//console.log(res.data.token);
						$cookies.put('token', res.data.token);
						$cookies.put('currentUser', $scope.user.userEmail);
						$rootScope.token = res.data.token;
						$rootScope.currentUser = $scope.user.userEmail;
						console.log($rootScope.currentUser);
						$location.path('user_home');
					}
					else{
						console.log("DOnt have token");
						$rootScope.loginMessageDisplay = true;
						$rootScope.showMessage = false;
						$location.path('login');	
					}
				});			
			}
			
		};

	}])

	.controller("UserHomeController", ['$rootScope', '$scope', '$http','$location','$cookies', 
		function($rootScope, $scope, $http,$location,$cookies){
		$scope.isAuthenticated = function(){
			if($cookies.get('token') && $cookies.get('currentUser')){
	            $scope.isAuthenticate = true;
	            
	        }
	        else{
				$scope.isAuthenticate = false;
				alert('You have to login first');
	        	$location.path('login');
	        }

		}

		
		$http.get('/getPublishers')
			.then(function(res){
				$scope.disPublishers = res.data;
			});

		$scope.applyToPub = function(pubId){
			console.log('id: ' + pubId);
			$rootScope.currentApplication = pubId;
		}

	}])


	.controller("PublisherEditController", ['$rootScope', '$scope', '$http','$location','$cookies', 
		function($rootScope, $scope, $http,$location,$cookies){
		
			$scope.isAuthenticated = function(){
				if($cookies.get('token') && $cookies.get('currentUser')){
		            $scope.isAuthenticate = true;
		            
		        }
		        else{
					$scope.isAuthenticate = false;
					alert('You have to login first');
		        	$location.path('login');
		        }

			}
		
			$scope.pubDetails ={};
			$http.post('/getCurrentPublisher', {user: $rootScope.currentUser})
				.then(function(res){
					//console.log(res.data.publisher);
					$scope.pubDetails =res.data.publisher;
				});

			$scope.saveChanges= function(){
				var newDetail = $scope.pubDetails;
				$http.post('/savePublisherChanges', {user:newDetail})
					.then(function(res){
						console.log("changes Done");
						console.log(res.data.publisher);
						$location.path('publisher_home');

					})
			}
			$scope.cancel = function(){
				$location.path('publisher_home');				
			}

	}])


;