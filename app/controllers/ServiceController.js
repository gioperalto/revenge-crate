'use strict'

let Service = require('../models/Service');

module.exports = {
  getServices: (callback) => {
    Service.find().exec((err, services) => {
      if(err) {
        callback(err);
      } else {
        callback(services);
      }
    });
  }
};