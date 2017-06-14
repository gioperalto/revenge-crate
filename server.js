'use strict'

let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    request = require('request'),
    creds = require('./config/creds'),
    stripe = require('stripe')(creds.stripe.keys.secret),
    seed = require('./app/utils/seed'),
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 3000;

// Allow Express to serve static files in "public" directory
app.use(express.static('public'));

// Middleware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database configurations
mongoose.Promise = require('bluebird');
mongoose.connect(creds.database.url);
seed.seedAll();

// Views + Templating
app.set('views', './views');
app.set('view engine', 'pug');

// ---------------------------------------------------------
// Route configurations
// ---------------------------------------------------------
let routes = {
  api: [
    'things'
  ],
  web: [
    'public'
  ]
};
for(let key in routes) {
  for(let route of routes[key]) {
    require('./app/routes/' + key + '/' + route)(router, request, stripe);
    console.log('Routing requests from: ' + key + '/' + route);
  }
}
app.use(router);

// Launch server
app.listen(port, () => {
    console.log('Listening on: ' + port);
});