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
  }
};