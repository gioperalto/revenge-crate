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
      res.render('public/revenge', {
        products: JSON.parse(body),
        key: pub_key
      });
    });
  });

  router.route('/purchase')
  .post((req, res, next) => {
    let shipping = {
      "address": {
        "city": req.body.shipping_city,
        "country": req.body.shipping_country,
        "line1": req.body.shipping_line1,
        "line2": req.body.shipping_line2 === '' ? null : req.body.shipping_line2,
        "postal_code": req.body.shipping_postal_code,
        "state": req.body.shipping_state
      },
      "name": req.body.shipping_name
    },
    order_data = {
      "order": req.body.selected_item_name
    };

    stripe.orders.create({
      currency: 'usd',
      items: [
        {
          type: 'sku',
          quantity: 1,
          parent: req.body.selected_item
        }
      ],
      shipping: shipping,
      email: req.body.email,
      metadata: order_data
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
          if(err) {
            res.redirect('/revenge', {
              status: 'There was a problem making a payment with the information provided.',
              success: false
            });
          }

          console.log(charge);
          res.redirect('/revenge', {
            status: 'A confirmation email has been sent. Thank you for your purchase!',
            success: true
          });
          // TODO: Send confirmation email to us
          // TODO: Send confirmation email to customer
        });
      }
    });
  });

};