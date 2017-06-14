'use strict'

let Thing = require('../models/Thing');

module.exports = {
  getThings: (callback) => {
    Thing.find()
    .exec((err, things) => {
      if(err) {
        callback(err);
      } else {
        callback(things);
      }
    });
  },

  getAvailableThings: (callback) => {
    Thing.find()
    .where('inventory').gt(0)
    .exec((err, things) => {
      if(err) {
        callback(err);
      } else {
        callback(things);
      }
    });
  },

  getThing: (thing_id, callback) => {
    Thing.findById(thing_id)
    .exec((err, thing) => {
      if(err) {
        callback(null);
      } else {
        callback(thing);
      }
    });
  }
};