angular.module("researchApp")
	
	.directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
    }])


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

		$scope.categories = ['Economics', 'Law Department', 'Computer Science'];
		$scope.pubToBeDisplay = [];
		$http.get('/getPublishers')
			.then(function(res){
				$scope.disPublishers = res.data;
				var len= res.data.length;
				var count =0;
				for(key in $scope.disPublishers){

					var obj = $scope.disPublishers[key];
					
					if(obj['pubAbout'] && obj.pubAbout.length>50 && obj.pubApplyBy.length>2){
						$scope.pubToBeDisplay[count] = obj;
						//console.log(obj);
						count++;
					}
				}
			});
		
		
		$scope.applyToPub = function(userEmail ,pubTitle){
			//console.log('id: ' + userEmail);
			$rootScope.currentApplication = userEmail;
			$rootScope.currentApplicationTitle = pubTitle;
			$location.path('submit');
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

	
	.controller("ApplicationSubmitController", ['$rootScope', '$scope', '$http','$location','$cookies',
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
			$scope.pubEmail = $rootScope.currentApplication;
			console.log($scope.pubEmail);
			$scope.pubTitle = $rootScope.currentApplicationTitle;
			console.log($scope.pubTitle);
			var fd = new FormData();
			$scope.submit = function (){
				var application = {
					authorEmail: $rootScope.currentUser,
					pubEmail: $scope.pubEmail,
					pubTitle: $scope.pubTitle,
					
					title:$scope.title,
					department:$scope.department,
					name:$scope.name,
					appEmail:$scope.appEmail,
					phone:$scope.phone,
					correspondingAuthor:$scope.correspondingAuthor,
					manTitle:$scope.manTitle,
					manAbstract:$scope.manAbstract,
					status: 'Pending',
					doc: $scope.myFile
				}
				fd.append('authorEmail', application.authorEmail);
	           	fd.append('pubEmail', application.pubEmail);
	           	fd.append('pubTitle', application.pubTitle);
	           	fd.append('title', application.title);
	           	fd.append('department', application.department);
	           	fd.append('name', application.name);
	           	fd.append('appEmail', application.appEmail);
	           	fd.append('phone', application.phone);
	           	fd.append('correspondingAuthor', application.correspondingAuthor);
	           	fd.append('manTitle', application.manTitle);
	           	fd.append('manAbstract', application.manAbstract);
	           	fd.append('status', application.status);
	           	fd.append('doc', application.doc);
	           	
				console.log(fd);
				$http.post("/submitAppliation", fd, {transformRequest: angular.identity,headers: {'Content-Type': undefined}})
					.then(function(res){
						if(res.data.success){
							$rootScope.currentApplication = null;
							alert("successfully Applied");
							$location.path("user_home");
						}
						else{
							alert("Cannot process the request\n. Try again later ");
							$location.path("user_home");
						}
						
					})
			}

		}])

	.controller("UserDashboardController", ['$rootScope', '$scope', '$http','$location','$cookies', 
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
		$http.post("/getApplications",{user: $rootScope.currentUser}).then(function(res){
			//console.log(res.data.apps);
			$scope.apps = res.data.apps;

		})
		

	}])


;