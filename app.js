var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // not needed once split
var mongoose = require('mongoose');			 // Same ^^
var faker = require('faker');

// serve the files out of ./public as our main files - only app.js
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// configure app to use bodyParser() - used by all services
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// MongoDB - used by all services
if(process.env.VCAP_SERVICES){
	var services = JSON.parse(process.env.VCAP_SERVICES);
  if(services.mongolab) {
    uri = services.mongolab[0].credentials.uri;
  } else {
    uri = process.env.MONGO_URI;
  }
} else {
	uri = process.env.MONGO_URI;
}

mongoose.connect(uri);

// Mongoose Models
var Product = require('./models/product'); // used in cart & product services
var Review = require('./models/review');	 // used in review service

// Set up /api router - (all services)
var router = express.Router();

// middleware to use for all requests (JSON) - (all services)
router.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		var body = JSON.stringify(req.body);
    console.log('[Request] '+req.method+' ' + req.url + ' - Body: ' + body);
    next();
});


/* ------------------------------------------------------------------------
--  C A R T  A P I  -------------------------------------------------------
------------------------------------------------------------------------ */

router.route('/cart').get(function(req, res) {
	Product.find({ inCart: true }, function(err, products) {
		if (err)
			res.send(err);
		res.json(products);
	});
});

router.route('/cart/count').get(function(req, res) {
	Product.count({ inCart: true }, function(err, count){
		res.json({ count: count });
	});
});

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
--  R E V I E W S  A P I  -------------------------------------------------
------------------------------------------------------------------------ */

router.route('/reviews/:product_id')
	// get the reviews associated with the passed product id
	.get(function(req, res) {
			Review.find({ productId: req.params.product_id }, function(err, review) {
					if (err)
							res.send(err);
					res.json(review);
			});
	})

	// add a new review for a product
	.post(function(req, res) {

			var review = Review();
			review.productId = req.body.productId;
			review.stars = req.body.stars;
			review.body = req.body.body;
			review.author = req.body.author;

			// save the new review
			review.save(function(err) {
					if (err)
							res.send(err);
					res.json({ message: 'Review Successfully Added!'});
			});

	});

/* ------------------------------------------------------------------------
--  P R O D U C T S  A P I  -----------------------------------------------
------------------------------------------------------------------------ */

router.route('/products').get(function(req, res) {
    Product.find(function(err, products) {
        if (err)
            res.send(err);

        res.json(products);
    });
});

router.route('/products/:product_id')

    // get the product with that id (accessed at GET http://localhost:6005/api/products/:product_id)
    .get(function(req, res) {
        Product.findById(req.params.product_id, function(err, product) {
            if (err)
                res.send(err);
            res.json(product);
        });
    })

		// update the product to be in the cart
    .put(function(req, res) {

        // use our product model to find the product we want
        Product.findById(req.params.product_id, function(err, product) {

            if (err)
                res.send(err);

            product.inCart = req.body.inCart;  // update the products info

            // save the product
            product.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Product updated. (' + product._id + ')'});
            });
        });
    });

	// Product json Faker
	var jsonFaker = require('./faker.js');

	app.get('/faker/:count', function(req, res) {
	    Product.remove({}, function(err) {
	       console.log('product collection removed')
	    });

			Review.remove({}, function(err) {
	       console.log('review collection removed')
	    });

			// faker.js creates fake json and we insert it into the DB
	    for (var i = 0; i < req.params.count; i++) {
	        var sample = jsonFaker.fakeOut();
	        var product = new Product();      // create a new instance of the Product model
	        product.name = sample.name;  	  // set the products name (comes from the request)
	        product.price = sample.price;
	        product.description = sample.description;

					// used to append to image url - this prevents caching
					var randomInt = Math.floor(Math.random() * (1000 - 0));

	        product.image = "http://lorempixel.com/360/300/?v=" + randomInt;
					product.inCart = false;
	        product.save(function(err, prod) {
	            if (err) { return console.error("Error faking data"); };

							// save reviews
							for (var i = 0; i < 2; i++) {
								var review = new Review();
								var fakeReview = jsonFaker.fakeReview()
								review.productId = prod.id;
								review.stars = fakeReview.stars;
								review.body = faker.lorem.sentence();
								review.author = fakeReview.author;
								review.save(function(err) {
				            if (err) { console.error("Error faking data"); };
				        });
							}
	        });

	    };

			console.log('Successfully faked '+req.params.count+' document(s)!');
	    res.json({ message: 'Successfully faked '+req.params.count+' document(s)!' });
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
