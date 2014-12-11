'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Teams', '$http',
	function($scope, $stateParams, $location, Authentication, Teams, $http) {
		$scope.authentication = Authentication;

		// Create new Team
		$scope.create = function() {
			// Create new Team object
			var team = new Teams ({
				name: this.name,
                                players: [{last_name: "hammond", first_name: "cole", jersey: 11}]
			});

			// Redirect after save
			team.$save(function(response) {
				$location.path('teams/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Team
		$scope.remove = function(team) {
			if ( team ) { 
				team.$remove();

				for (var i in $scope.teams) {
					if ($scope.teams [i] === team) {
						$scope.teams.splice(i, 1);
					}
				}
			} else {
				$scope.team.$remove(function() {
					$location.path('teams');
				});
			}
		};

		// Update existing Team
		$scope.update = function() {
			var team = $scope.team;
			team.$update(function() {
				$location.path('teams/' + team._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Teams
		$scope.find = function() {
			$scope.teams = Teams.query();
		};

		// Find existing Team
		$scope.findOne = function() {
			$scope.team = Teams.get({ 
				teamId: $stateParams.teamId
			});
		};
                
		// Find existing Team
		$scope.addPlayer = function() {
//                        $scope.team.players.push($scope.player);
//                        console.log($scope.team);
                        var team = $scope.team;
                        team.players.push({
                            first_name: "whatevber",
                            last_name: "test",
                            jersey: 1
                        });
                        $scope.update();
		};    
                
                $scope.remove = function(player) {
                    var team = $scope.team;
                    $http({
                        method: 'DELETE',
                        url: 'teams/' + team._id + '/player',
                        data: {team: team, player: player}
                    }).success(function(response) {
                        $scope.findOne();
                    }).error(function(response) {
                        $scope
                                .error = response.message;
                    });

                }
	}
]);