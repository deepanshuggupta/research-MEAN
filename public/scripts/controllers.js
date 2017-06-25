angular.module("researchApp")
	

	.controller("HomeController", ['$scope', '$http',function ($scope, $http){
		$http.get('/featuredPublishers')
			.then(function(res){
					$scope.featuredPublishers = res.data;
			})
	}])

	.controller("SignupController", ['$scope','$http', function($scope,$http){

		
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
				$http.get('/loginPublisher').then(function(res){

				});
			}
			else{
				console.log("Author login");
			}
			
		};

	}])

;