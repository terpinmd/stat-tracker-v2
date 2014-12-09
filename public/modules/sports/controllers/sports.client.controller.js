'use strict';

// Sports controller
angular.module('sports').controller('SportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sports',
	function($scope, $stateParams, $location, Authentication, Sports) {
		$scope.authentication = Authentication;

		// Create new Sport
		$scope.create = function() {
			// Create new Sport object
			var sport = new Sports ({
				name: this.name
			});

			// Redirect after save
			sport.$save(function(response) {
				$location.path('sports/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sport
		$scope.remove = function(sport) {
			if ( sport ) { 
				sport.$remove();

				for (var i in $scope.sports) {
					if ($scope.sports [i] === sport) {
						$scope.sports.splice(i, 1);
					}
				}
			} else {
				$scope.sport.$remove(function() {
					$location.path('sports');
				});
			}
		};

		// Update existing Sport
		$scope.update = function() {
			var sport = $scope.sport;

			sport.$update(function() {
				$location.path('sports/' + sport._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sports
		$scope.find = function() {
			$scope.sports = Sports.query();
		};

		// Find existing Sport
		$scope.findOne = function() {
			$scope.sport = Sports.get({ 
				sportId: $stateParams.sportId
			});
		};
	}
]);