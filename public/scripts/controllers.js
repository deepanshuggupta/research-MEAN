angular.module("researchApp")
	

	.controller("HomeController", ['$scope', '$http',function ($scope, $http){
		$http.get('/featuredPublishers')
			.then(function(res){
					$scope.featuredPublishers = res.data;
			})
	}])

	.controller("SignupController", ['$scope','$http', function($scope,$http){
		
		$scope.signup = function(){
			var newUser = {
				'firstName': $scope.firstName,
				'lastName': $scope.lastName,
				'userEmail': $scope.userEmail,
				'userPassword': $scope.userPassword,
				'role': $scope.role
				
			};
			console.log(newUser);
		
		}
	}])

	.controller("LoginController", ['$scope', '$http', function($scope, $http){
		$scope.user = {};
		$scope.login = function(){
			$scope.user = {
				'userEmail': $scope.userEmail,
				'userPassword': $scope.userPassword,
				'role': $scope.role,
				'isRemember': $scope.isRemember
			};
			console.log($scope.user);
			if($scope.user.role == "Publisher"){
				console.log("publisher login");
				$http.post('/loginPublisher', $scope.user).then(function(res){
					console.log("success: " + res.data);
					
				});
			}
			else{
				console.log("Author login");
				$http.post('/loginAuthor',  user).then(function(res){
					console.log("success: " + res.data);
				});			
			}
			
		};

	}])

;