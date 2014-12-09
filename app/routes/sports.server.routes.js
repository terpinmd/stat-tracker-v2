'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sports = require('../../app/controllers/sports.server.controller');

	// Sports Routes
	app.route('/sports')
		.get(sports.list)
		.post(users.requiresLogin, sports.create);

	app.route('/sports/:sportId')
		.get(sports.read)
		.put(users.requiresLogin, sports.hasAuthorization, sports.update)
		.delete(users.requiresLogin, sports.hasAuthorization, sports.delete);

	// Finish by binding the Sport middleware
	app.param('sportId', sports.sportByID);
};
