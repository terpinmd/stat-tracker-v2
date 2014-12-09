'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sport = mongoose.model('Sport'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sport;

/**
 * Sport routes tests
 */
describe('Sport CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Sport
		user.save(function() {
			sport = {
				name: 'Sport Name'
			};

			done();
		});
	});

	it('should be able to save Sport instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sport
				agent.post('/sports')
					.send(sport)
					.expect(200)
					.end(function(sportSaveErr, sportSaveRes) {
						// Handle Sport save error
						if (sportSaveErr) done(sportSaveErr);

						// Get a list of Sports
						agent.get('/sports')
							.end(function(sportsGetErr, sportsGetRes) {
								// Handle Sport save error
								if (sportsGetErr) done(sportsGetErr);

								// Get Sports list
								var sports = sportsGetRes.body;

								// Set assertions
								(sports[0].user._id).should.equal(userId);
								(sports[0].name).should.match('Sport Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sport instance if not logged in', function(done) {
		agent.post('/sports')
			.send(sport)
			.expect(401)
			.end(function(sportSaveErr, sportSaveRes) {
				// Call the assertion callback
				done(sportSaveErr);
			});
	});

	it('should not be able to save Sport instance if no name is provided', function(done) {
		// Invalidate name field
		sport.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sport
				agent.post('/sports')
					.send(sport)
					.expect(400)
					.end(function(sportSaveErr, sportSaveRes) {
						// Set message assertion
						(sportSaveRes.body.message).should.match('Please fill Sport name');
						
						// Handle Sport save error
						done(sportSaveErr);
					});
			});
	});

	it('should be able to update Sport instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sport
				agent.post('/sports')
					.send(sport)
					.expect(200)
					.end(function(sportSaveErr, sportSaveRes) {
						// Handle Sport save error
						if (sportSaveErr) done(sportSaveErr);

						// Update Sport name
						sport.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sport
						agent.put('/sports/' + sportSaveRes.body._id)
							.send(sport)
							.expect(200)
							.end(function(sportUpdateErr, sportUpdateRes) {
								// Handle Sport update error
								if (sportUpdateErr) done(sportUpdateErr);

								// Set assertions
								(sportUpdateRes.body._id).should.equal(sportSaveRes.body._id);
								(sportUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sports if not signed in', function(done) {
		// Create new Sport model instance
		var sportObj = new Sport(sport);

		// Save the Sport
		sportObj.save(function() {
			// Request Sports
			request(app).get('/sports')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sport if not signed in', function(done) {
		// Create new Sport model instance
		var sportObj = new Sport(sport);

		// Save the Sport
		sportObj.save(function() {
			request(app).get('/sports/' + sportObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sport.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sport instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sport
				agent.post('/sports')
					.send(sport)
					.expect(200)
					.end(function(sportSaveErr, sportSaveRes) {
						// Handle Sport save error
						if (sportSaveErr) done(sportSaveErr);

						// Delete existing Sport
						agent.delete('/sports/' + sportSaveRes.body._id)
							.send(sport)
							.expect(200)
							.end(function(sportDeleteErr, sportDeleteRes) {
								// Handle Sport error error
								if (sportDeleteErr) done(sportDeleteErr);

								// Set assertions
								(sportDeleteRes.body._id).should.equal(sportSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sport instance if not signed in', function(done) {
		// Set Sport user 
		sport.user = user;

		// Create new Sport model instance
		var sportObj = new Sport(sport);

		// Save the Sport
		sportObj.save(function() {
			// Try deleting Sport
			request(app).delete('/sports/' + sportObj._id)
			.expect(401)
			.end(function(sportDeleteErr, sportDeleteRes) {
				// Set message assertion
				(sportDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sport error error
				done(sportDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sport.remove().exec();
		done();
	});
});