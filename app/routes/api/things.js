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

  router.route('/api/things/:thing')
  .get((req, res, next) => {
    let thing_id = req.param.thing_id;

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

    next(new Error('Incorrect entry of endpoint.'));
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

    next(new Error('Incorrect entry of endpoint.'));
  });

};