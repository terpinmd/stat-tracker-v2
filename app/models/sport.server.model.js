'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sport Schema
 */
var SportSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Sport name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Sport', SportSchema);