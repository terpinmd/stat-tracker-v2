'use strict';

// Configuring the Articles module
angular.module('sports').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sports', 'sports', 'dropdown', '/sports(/create)?');
		Menus.addSubMenuItem('topbar', 'sports', 'List Sports', 'sports');
		Menus.addSubMenuItem('topbar', 'sports', 'New Sport', 'sports/create');
	}
]);