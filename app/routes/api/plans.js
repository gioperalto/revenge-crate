'use strict'

let PlanController = require('../../controllers/PlanController');

module.exports = (router) => {

  router.route('/api/plans')
  .get((req, res, next) => {
    PlanController.getPlans((plans) => {
      res.json(plans);
    });
  })
  .post((req, res, next) => {
    next(new Error('Not implemented yet.'));
  });

};