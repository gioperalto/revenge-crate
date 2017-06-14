'use strict'
// app/models/Thing.js

// grab the things we need
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// create a schema
var thingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    inventory: {
        type: Number,
        default: 0
    },
    image: String,
    created_at: Date,
    modified_at: Date
});

// on every save, add the date
thingSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
  
    // change the modified_at field to current date
    this.modified_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Thing = mongoose.model('Thing', thingSchema);

// make this available to our users in our Node applications
module.exports = Thing;