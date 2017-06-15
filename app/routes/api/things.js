'use strict'

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

};