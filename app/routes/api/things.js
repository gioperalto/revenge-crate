'use strict'

let ThingController = require('../../controllers/ThingController');

module.exports = (router) => {

  router.route('/api/things')
  .get((req, res, next) => {
    ThingController.getThings((things) => {
      res.json(things);
    });
  })
  .post((req, res, next) => {
    next(new Error('Not implemented yet.'));
  });

};