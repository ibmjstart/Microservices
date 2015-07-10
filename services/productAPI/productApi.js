var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// configure app to use bodyParser()
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
