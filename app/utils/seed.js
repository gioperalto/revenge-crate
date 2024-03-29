'use strict'

let async = require('async'),
    seeds = require('../../config/seeds'),

module.exports = {
  seedItems: (items, model, callback) => {
    model.count({}, (err, num) => {
      if(num == 0) {
        console.log('seeding items into DB...');
        console.log(items);

        async.each(items, (item, cb) => {
          let obj = new model(item);

          obj.save((err) => {
            if(err) {
              cb(err);
            }
            cb(null);
          });
        }, (err) => {
          if(err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      } else {
        callback(null);
      }
    });
  },

  seedAll: () => {
    let start = Date.now();

    async.waterfall([], function(err) {
      if(err) {
        console.log(err);
      }
      console.log('\nSync has completed in ' + (Date.now()-start)/1000 + 's.\n');
    });
  }
};