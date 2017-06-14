'use strict'

let protocol = 'http://',
    pub_key = require('../../../config/creds').stripe.keys.public,
    product_id = require('../../../config/creds').stripe.product.id;

module.exports = (router, request, stripe) => {

  router.route('/')
  .get((req, res, next) => {
    res.render('public/home');
  });

  router.route('/revenge')
  .get((req, res, next) => {
    let things_endpoint = protocol+req.get('host')+'/api/products/'+product_id;

    request(things_endpoint, (error, response, body) => {
      res.render('public/things', {
        things: JSON.parse(body),
        key: pub_key
      });
    });
  });

  router.route('/purchase')
  .post((req, res, next) => {
    stripe.orders.create({
      currency: 'usd',
      items: [
        {
          type: 'sku',
          parent: req.body.selected_item
        }
      ],
      shipping: req.body.shipping,
      email: req.body.email
    }, (error, order) => {
      if(error) {
        res.send(error);
      } else {
        let token = req.body.stripeToken;

        stripe.charges.create({
          amount: order.amount,
          currency: order.currency,
          description: 'Charge for ' + order.email,
          receipt_email: order.email,
          shipping: order.shipping,
          order: order.id,
          source: token,
          statement_descriptor: 'Revenge Crate'
        }, (err, charge) => {
          console.log(charge);
          // TODO: Send confirmation email to us
          // TODO: Send confirmation email to customer
        });
      }
    });
  });

};