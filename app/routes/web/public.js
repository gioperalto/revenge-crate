'use strict'

module.exports = (request, router) => {

  router.route('/')
  .get((req, res, next) => {
    res.render('public/home');
  });

  router.route('/things')
  .get((req, res, next) => {
    request('/api/things', (error, response, body) => {
      res.render('public/home', {
        things: res.json(body)
      });
    });
  });

};