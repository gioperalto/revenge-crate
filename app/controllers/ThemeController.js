'use strict'

let Theme = require('../models/Theme');

module.exports = {
  getThemes: (callback) => {
    Theme.find().exec((err, themes) => {
      if(err) {
        callback(err);
      } else {
        callback(themes);
      }
    });
  }
};