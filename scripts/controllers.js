angular.module("researchApp")
	.controller("HomeController", ['$scope', function ($scope){
		var featuredPublishers = [
			{
				'title': 'TMH',
				'about': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti atque, tenetur quam aspernatur corporis at explicabo nulla dolore necessitatibus doloremque exercitationem sequi dolorem architecto perferendis quas aperiam debitis dolor soluta!'
			},
			{
				'title': 'Schaum\'s',
				'about': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti atque, tenetur quam aspernatur corporis at explicabo nulla dolore necessitatibus doloremque exercitationem sequi dolorem architecto perferendis quas aperiam debitis dolor soluta!'
			},
			{
				'title': 'S. Chand',
				'about': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti atque, tenetur quam aspernatur corporis at explicabo nulla dolore necessitatibus doloremque exercitationem sequi dolorem architecto perferendis quas aperiam debitis dolor soluta!'
			},
			{
				'title': 'DV hall',
				'about': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti atque, tenetur quam aspernatur corporis at explicabo nulla dolore necessitatibus doloremque exercitationem sequi dolorem architecto perferendis quas aperiam debitis dolor soluta!'
			}
		];
		$scope.featuredPublishers = featuredPublishers;
		
	}]);