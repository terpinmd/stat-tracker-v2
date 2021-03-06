'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Team Schema
 */
var PlayerSchema = new Schema({
    last_name: {
      type: String,
      trim: true,
      max:20
    },
    first_name: {
      type: String,
      trim: true,
      max:20
    },
    jersey:{
      type: String,
      trim: true,
      max:30
    }
});

mongoose.model('Player', PlayerSchema);

/**
 * Team Schema
 */
var TeamSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Team name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
        players:[PlayerSchema]
});

mongoose.model('Team', TeamSchema);