'use strict';

//Setting up route
angular.module('sports').config(['$stateProvider',
	function($stateProvider) {
		// Sports state routing
		$stateProvider.
		state('listSports', {
			url: '/sports',
			templateUrl: 'modules/sports/views/list-sports.client.view.html'
		}).
		state('createSport', {
			url: '/sports/create',
			templateUrl: 'modules/sports/views/create-sport.client.view.html'
		}).
		state('viewSport', {
			url: '/sports/:sportId',
			templateUrl: 'modules/sports/views/view-sport.client.view.html'
		}).
		state('editSport', {
			url: '/sports/:sportId/edit',
			templateUrl: 'modules/sports/views/edit-sport.client.view.html'
		});
	}
]);