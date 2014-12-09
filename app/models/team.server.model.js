'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
        players:[{
            last_name: {
              type: String,
              trim: true,
              max:2000
            },
            first_name: {
              type: String,
              trim: true,
              max:2000
            },
            jersey:{
                type: Number
            }
        }]
});

mongoose.model('Team', TeamSchema);