'use strict'

module.exports = (router, request, stripe) => {

  router.route('/api/creatures/:product_id')
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

  router.route('/api/creatures/random/:product_id')
  .get((req, res, next) => {
    stripe.products.retrieve(
      req.params.product_id,
      (err, product) => {
        if(err) {
          res.json(error);
        }

        let things = product.skus.data;

        for(let thing in things) {
          if(things[thing].image === null) {
            things.splice(thing, 1);
          }
        }

        let randomThing = things[Math.floor(Math.random() * things.length)];

        res.json(randomThing);
      }
    );
  });

};