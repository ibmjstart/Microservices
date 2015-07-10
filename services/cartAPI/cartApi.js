var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// configure app to use bodyParser()
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// MongoDB
if(process.env.VCAP_SERVICES){
	var services = JSON.parse(process.env.VCAP_SERVICES);
	uri = services.mongolab[0].credentials.uri;
} else {
	uri = process.env.MONGO_URL;
}
mongoose.connect(uri);

// Mongoose Models
var Product = require('./models/product');

// Set up /api router
var router = express.Router();

// middleware to use for all requests (JSON)
router.use(function(req, res, next) {
		var body = JSON.stringify(req.body);
    console.log('[Request] '+req.method+' ' + req.url + ' - Body: ' + body);
    next();
});

/* ------------------------------------------------------------------------
--  C A R T  A P I  -------------------------------------------------------
------------------------------------------------------------------------ */

// get cart contents
router.route('/cart').get(function(req, res) {
	Product.find({ inCart: true }, function(err, products) {
		if (err)
			res.send(err);
		res.json(products);
	});
});

// get the number of items in the cart (nav bar)
router.route('/cart/count').get(function(req, res) {
	Product.count({ inCart: true }, function(err, count){
		res.json({ count: count });
	});
});

// verifies that the gift card is not expired
router.route('/checkout/verifyPayment').put(function(req, res) {
	var now = new Date();
	var currentMonth = now.getMonth();
	var currentYear = now.getFullYear();

	if (currentYear > req.body.year || (currentYear === req.body.year && currentMonth > req.body.month) ) {
		return res.json({"status": "expired"});
	}

	// order processed, clear the cart.
	Product.update({ inCart: true }, { $set: { inCart: false } }, { multi: true });

	res.json({"status": "verified"});
});

/* ------------------------------------------------------------------------
--  S T A R T  S E R V E R  -----------------------------------------------
------------------------------------------------------------------------ */

app.use('/api', router);

// get the app environment from Cloud Foundry
var port = process.env.PORT || 8080;

// start server on the specified port and binding host
app.listen(port, function() {
  console.log("server starting on port: " + port);
});
