'use strict'

module.exports = (router) => {
  router.route('*')
  .get((req, res, next) => {
    res.render('404', {
      title: 'Page Not Found',
      description: '',
      keywords: ''
    });
  });
};