'use strict'

let Plan = require('../models/Plan');

module.exports = {
  getPlans: (callback) => {
    Plan.find().exec((err, plans) => {
      if(err) {
        callback(err);
      } else {
        callback(plans);
      }
    });
  }
};