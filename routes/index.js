// Requires path modulo and the models Ingredient and Order
var path = require('path');
var Person = require(path.join(__dirname,'../models/personModel'));
var Twotte = require(path.join(__dirname,'../models/twotteModel'));

// ErrorHandler method
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

// Initializes routes new object
var routes = {};

// Home method renders home.handlebars
routes.home = function(req, res) {
	res.render('home');
}

module.exports = routes;