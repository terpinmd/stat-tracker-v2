'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sport = mongoose.model('Sport'),
	_ = require('lodash');

/**
 * Create a Sport
 */
exports.create = function(req, res) {
	var sport = new Sport(req.body);
	sport.user = req.user;

	sport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sport);
		}
	});
};

/**
 * Show the current Sport
 */
exports.read = function(req, res) {
	res.jsonp(req.sport);
};

/**
 * Update a Sport
 */
exports.update = function(req, res) {
	var sport = req.sport ;

	sport = _.extend(sport , req.body);

	sport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sport);
		}
	});
};

/**
 * Delete an Sport
 */
exports.delete = function(req, res) {
	var sport = req.sport ;

	sport.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sport);
		}
	});
};

/**
 * List of Sports
 */
exports.list = function(req, res) { 
	Sport.find().sort('-created').populate('user', 'displayName').exec(function(err, sports) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sports);
		}
	});
};

/**
 * Sport middleware
 */
exports.sportByID = function(req, res, next, id) { 
	Sport.findById(id).populate('user', 'displayName').exec(function(err, sport) {
		if (err) return next(err);
		if (! sport) return next(new Error('Failed to load Sport ' + id));
		req.sport = sport ;
		next();
	});
};

/**
 * Sport authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sport.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
