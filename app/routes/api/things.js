'use strict'

let ThingController = require('../../controllers/ThingController');

module.exports = (router, request, stripe) => {

  router.route('/api/products/:product_id')
  .get((req, res, next) => {
    stripe.products.retrieve(
      req.params.product_id,
      (err, product) => {
        if(err) {
          res.json(error);
        }

        res.json(product.skus.data);
      }
    );
  });

  router.route('/api/things')
  .get((req, res, next) => {
    if(req.query.expanded) {
      ThingController.getThings((things) => {
        res.json(things);
      });
    }

    ThingController.getAvailableThings((things) => {
      res.json(things);
    });
  })
  .post((req, res, next) => {
    next(new Error('Not implemented yet.'));
  });

  router.route('/api/things/:thing')
  .get((req, res, next) => {
    let thing_id = req.params.thing;

    ThingController.getThing(thing_id, (thing) => {
      res.json(thing);
    });
  });

  router.route('/api/things/add/:thing')
  .put((req, res, next) => {
    if(req.body.inventory) {
      let inventory = parseInt(req.body.inventory),
          thing_id = req.param.thing_id;

      ThingController.getThing(thing_id, (thing) => {
        thing.inventory += inventory;
        
        thing.save((err) => {
          if(err) {
            res.json(err);
          }

          res.json(thing);
        });
      });
    }

    res.send('Incorrect entry of api endpoint.');
  });

  router.route('/api/things/sell/:thing')
  .put((req, res, next) => {
    if(req.body.token) {
      let thing_id = req.param.thing_id;

      ThingController.getThing(thing_id, (thing) => {
        thing.inventory--;

        thing.save((err) => {
          if(err) {
            res.json(err);
          }

          res.json(thing);
        });
      });
    }

    res.send('Incorrect entry of api endpoint.');
  });

};