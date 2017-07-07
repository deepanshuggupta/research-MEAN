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

	// For Home page
	.controller("HomeController", ['$scope', '$http',function ($scope, $http){
		$http.get('/featuredPublishers')
			.then(function(res){
					$scope.featuredPublishers = res.data;
			});
	}])


	// for signup Page
	.controller("SignupController", ['$scope','signupFactory', function($scope,signupFactory){
		
		$scope.signup = function(){
			$scope.newUser = {
				'firstName': $scope.firstName,
				'lastName': $scope.lastName,
				'userEmail': $scope.userEmail,
				'userPassword': $scope.userPassword,
				'role': $scope.role
				
			};
			signupFactory.sendData($scope.newUser);
			
		}
	}])

	.controller("LoginController", ['$rootScope','$scope','loginFactory','$cookies','$location', function($rootScope, $scope,loginFactory, $cookies, $location){
		
		loginFactory.loginMessageDisplay = false;
		$scope.login = function(){
			$scope.user = {
				'userEmail': $scope.userEmail,
				'userPassword': $scope.userPassword,
				'role': $scope.role
			};
			var myFunction = function(result, role){
				if(result !== null && role =='Author'){
					console.log("Hi this is token: " + result);
					$cookies.put('token',result);
					$rootScope.token = result;
					$location.path('user_home');
				} 
				else if(result !== null && role =='Publisher'){
					console.log("Hi this is token: " + result);
					$cookies.put('token',result);
					$rootScope.token = result;
					$location.path('publisher_home');
				} 
				else{
					console.log("Hi I dont have token " );
					alert("Yo Man Bad Login credetials");
					$location.path('login');
				} 
			}
			loginFactory.sendData($scope.user, myFunction);
			
		};

	}])

	.controller("UserHomeController", ['$rootScope', '$scope', '$http','$location','$cookies','userHomeFactory', 
		function($rootScope, $scope, $http,$location,$cookies,userHomeFactory){
		
		$scope.categories = userHomeFactory.categories;	
		$scope.isAuthenticated = function(){
			if(!$cookies.get('token')) $location.path('login');
		}

		var callback = function(result){
			$scope.Publishers = result;
			$scope.disPublishers = userHomeFactory.by_profile($scope.Publishers);
		}
		userHomeFactory.getPublishers($rootScope.token, callback);
		
		$scope.apply = function(id){
			$rootScope.applicationId = id;
			$location.path('submit');
		}

	}])

	.controller("ApplicationSubmitController", ['ApplicationSubmitFactory','$rootScope', '$scope','$location','$cookies',
		function(ApplicationSubmitFactory,$rootScope, $scope,$location,$cookies){
			
			$scope.isAuthenticated = function(){
				if(!$cookies.get('token')) $location.path('login');
			}

			var callback = function(result){
				if(result){
					$rootScope.applicationId = null;
					alert("successfully Applied");
					$location.path("user_home");
				}
				else{
					alert("Cannot process the request\n. Try again later ");
					$location.path("user_home");
				}
			}
			$scope.pubId = $rootScope.applicationId;
			$scope.submit = function (){

				var application = {
					authorization:$cookies.get('token'),
					pubId: $scope.pubId,
					title:$scope.title,
					department:$scope.department,
					name:$scope.name,
					phone:$scope.phone,
					correspondingAuthor:$scope.correspondingAuthor,
					manTitle:$scope.manTitle,
					manAbstract:$scope.manAbstract,
					status: 'Pending',
					doc: $scope.myFile
				}
				ApplicationSubmitFactory.sendData(application, callback);
	        }

	}])

	.controller("UserDashboardController", ['userDashboardFactory','$rootScope', '$scope', '$http','$location','$cookies', 
		function(userDashboardFactory, $rootScope, $scope, $http,$location,$cookies){
		
		$scope.isAuthenticated = function(){
			if(!$cookies.get('token')) $location.path('login');
		}
		
		var callback = function(result){
			$scope.apps = result;
		}
		userDashboardFactory.getData($cookies.get('token'), callback);
		
		$scope.reviewApplication = function(id){
			console.log(id);
			$rootScope.currrentId = id;
			$location.path('application');
		}
		

	}])

	.controller("ApplicationController", ['ApplicationFactory','$rootScope', '$scope','$cookies', 
		function(ApplicationFactory, $rootScope, $scope,$cookies){
		
		$scope.isAuthenticated = function(){
			if(!$cookies.get('token')) $location.path('login');
		}
		
		var callback = function(result){
			$scope.app= result;
		}
		
		ApplicationFactory.getData($rootScope.currrentId, callback);
		
		
		$scope.download = function(link){
			ApplicationFactory.download(link);
		}

	}])

	.controller("PublisherHomeController", ['PublisherHomeFactory','$rootScope', '$scope','$location','$cookies', '$window',
		function(PublisherHomeFactory,$rootScope, $scope,$location,$cookies,$window){
		
		$scope.isAuthenticated = function(){
			if(!$cookies.get('token')) $location.path('login');
		}
		var callbackForApp = function(result){
			$scope.requests= result;
		}
		
		PublisherHomeFactory.getData($cookies.get('token'), callbackForApp);
		$scope.reviewApplication = function(id){
			console.log("post "+id);
			$rootScope.currrentId = id;
			$location.path('application');
		}

		$scope.setId = function (id) {
			console.log("Clicked to: " + id);
			$scope.ratingId = id;
		}
		var callbackForSend = function(result){
			if(result) {
				console.log(res.data);
				alert("successfully rated");
				$window.location.reload();
			}
		}
		$scope.giveRating = function(){
			var reviewData = {
				_id: $scope.ratingId,
				status: $scope.status,
				comment:$scope.comment,
				rating: $scope.rating
			}
			PublisherHomeFactory.sendData(reviewData, callbackForSend);
			
		}
	}])


	.controller("PublisherEditController", ['PublisherEditFactory','$rootScope', '$scope', '$http','$location','$cookies', 
		function(PublisherEditFactory,$rootScope, $scope, $http,$location,$cookies){
		
			$scope.isAuthenticated = function(){
				if(!$cookies.get('token')) $location.path('login');
			}
				
			$scope.pubDetails ={};
			var callback = function(result){
				$scope.pubDetails = result;
			}
			PublisherEditFactory.getData($cookies.get('token'), callback)
			var callbackforSendData = function(result){
				console.log("changes Done");
				console.log(result);
				$location.path('publisher_home');
			}
			
			$scope.saveChanges= function(){
				var newDetail = $scope.pubDetails;
				PublisherEditFactory.sendData(newDetail, callbackforSendData)
			}
			$scope.cancel = function(){
				$location.path('publisher_home');				
			}

	}])

	
	.controller("PublisherDashboardController", ['PublisherHomeFactory','$rootScope', '$scope', '$http','$location','$cookies', 
		function(PublisherHomeFactory,$rootScope, $scope, $http,$location,$cookies){
		
		$scope.isAuthenticated = function(){
			if(!$cookies.get('token')) $location.path('login');
		}
		var callbackForApp = function(result){
			$scope.requests= result;
		}
		
		PublisherHomeFactory.getData($cookies.get('token'), callbackForApp);
		
		$scope.reviewApplication = function(id){
			console.log("post "+id);
			$rootScope.currrentId = id;
			$location.path('application');
		}
		

	}])

;