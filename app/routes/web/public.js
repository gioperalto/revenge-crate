'use strict'

module.exports = (router) => {

  router.route('/')
  .get((req, res, next) => {
    res.render('public/home');
  });

  router.route('/themes')
  .get((req, res, next) => {

  });

  router.route('/services')
  .get((req, res, next) => {
    
  });

};