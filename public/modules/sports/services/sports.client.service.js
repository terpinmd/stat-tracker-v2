'use strict';

//Sports service used to communicate Sports REST endpoints
angular.module('sports').factory('Sports', ['$resource',
	function($resource) {
		return $resource('sports/:sportId', { sportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);