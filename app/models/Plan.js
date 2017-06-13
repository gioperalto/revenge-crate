'use strict'
// app/models/Plan.js

// grab the things we need
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// create a schema
var planSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost: Number,
    stripe_id: String,
    created_at: Date,
    modified_at: Date
});

// on every save, add the date
planSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
  
    // change the modified_at field to current date
    this.modified_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Plan = mongoose.model('Plan', planSchema);

// make this available to our users in our Node applications
module.exports = Plan;