'use strict'

let Thing = require('../models/Thing');

module.exports = {
  getThings: (callback) => {
    Thing.find().exec((err, things) => {
      if(err) {
        callback(err);
      } else {
        callback(things);
      }
    });
  },

  getThing: (thing_id, callback) => {
    Thing.findOne(thing_id).exec((err, thing) => {
      if(err) {
        callback(err);
      } else {
        callback(thing);
      }
    });
  }
};