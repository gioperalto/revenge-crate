'use strict'

let protocol = 'http://',
    pub_key = require('../../../config/creds').stripe.keys.public,
    product_id = require('../../../config/creds').stripe.product.id,
    states = require('../../../config/states').states,
    questions = require('../../../config/faq').questions,
    mail = require('../../utils/gmail');

module.exports = (router, request, stripe) => {

  /* GET Requests */

  router.route('/')
  .get((req, res, next) => {
    res.render('public/home', {
      title: 'Revenge Crate',
      description: 'Revenge Crate provides a selection of scary creatures to send to someone for a low price.',
      keywords: 'revenge crate, revenge, crate, home, scare'
    });
  });

  router.route('/order')
  .get((req, res, next) => {
    let products_endpoint = protocol+req.get('host')+'/api/creatures/'+product_id;

    request(products_endpoint, (error, response, body) => {
      res.render('public/order', {
        title: 'Order',
        description: 'We can send ants, cockroaches, rats, scorpions, snakes, spiders, and other creepy creatures.',
        keywords: 'products, order, ants, cockroaches, rats, scorpions, snakes, spiders',
        products: JSON.parse(body),
        key: pub_key,
        states: states
      });
    });
  });

  router.route('/creature/:name')
  .get((req, res, next) => {
    let creature_endpoint = protocol+req.get('host')+'/api/creatures/random/'+product_id,
        name = req.params.name;

    request(creature_endpoint, (error, response, body) => {
      let creature = JSON.parse(body);

      res.render('public/creature', {
        title: 'Creature Scare',
        description: 'What creature creeps you out the most?',
        creature: creature.attributes.name,
        image: creature.image,
        url: protocol+req.get('host')+'/creature/'+name
      });
    });
  });

  router.route('/about')
  .get((req, res, next) => {
    res.render('public/about', {
      title: 'About',
      description: 'What is Revenge Crate? What do we send? What occasions can this be for?',
      keywords: 'revenge crate, about, gift, prank, trending, funny'
    });
  });

  router.route('/faq')
  .get((req, res, next) => {
    res.render('public/faq', {
      title: 'FAQ',
      description: 'How long will my order take? Do you ship outside the U.S.?',
      keywords: 'faq, shipping, fee, expect, price',
      questions: questions
    });
  });

  router.route('/terms')
  .get((req, res, next) => {
    res.render('public/terms', {
      title: 'Terms of Service',
      description: '',
      keywords: ''
    });
  });

  router.route('/privacy')
  .get((req, res, next) => {
    res.render('public/privacy', {
      title: 'Privacy Policy',
      description: '',
      keywords: ''
    });
  });

  /* POST Requests */

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
      order: req.body.selected_item_name,
      message: req.body.message
    };

    stripe.orders.create({
      currency: 'usd',
      items: [
        {
          type: 'sku',
          quantity: 1,
          parent: req.body.selected_item_id
        }
      ],
      shipping: shipping,
      email: req.body.email,
      metadata: order_data
    }, (error, order) => {
      if(error) {
        let status = 'There was an error the info provided. Please double check everything and try again.';
        res.redirect('/revenge?status='+status);
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
            mail.sendErrorEmail(err, body);
            res.redirect('/revenge?success=false');
          }

          stripe.skus.retrieve(
            req.body.selected_item_id,
            (e, sku) => {
              stripe.skus.update(sku.id, {
                inventory: { quantity: sku.inventory.quantity - 1 }
              });
              mail.sendEmail(req.body.email, order);
              res.redirect('/revenge?success=true');
            }
          );
        });
      }
    });
  });

};