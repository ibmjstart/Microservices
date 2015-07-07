(function(){
	var app = angular.module('store', ['store-products', 'checkout', 'ngRoute']);

	// configure our routes
	app.config(function($routeProvider) {

      $routeProvider

      // route for the home page
      .when('/', {
          templateUrl  : 'home.html',
					controller   : 'StoreController',
					controllerAs : 'store'
      })

      // route for the about page
      .when('/cart', {
          templateUrl  : 'cart.html',
          controller   : 'cartController',
					controllerAs : 'cartCtrl'
      })
  });

	app.factory('cart', function($http) {
	    var cart = [];
	    var cartService = {};

			cartService.load = function () {
				$http.get('/api/cart').success(function (data) {
					cart = data;
				});
			};

	    cartService.add = function(product) {
	      cart.push(product);

				// update db
				$http.put('/api/products/'+product._id, { inCart: true });
	    };

			// determines whether or not the item is in the cart
			cartService.inCart = function(product) {
				for (var i = 0; i < cart.length; i++) {
					if (cart[i]._id === product._id) {
						return true;
					}
				}
				return false;
			};

			cartService.remove = function (product) {
				var index = -1;
				for (var i = 0; i < cart.length; i++) {
					if (cart[i]._id === product._id) {
						index = i;
						break;
					}
				}
				if (index !== -1) {
					cart.splice(index, 1);
					$http.put('/api/products/'+product._id, { inCart: false });
				}
			};

	    cartService.list = function() {
	        return cart;
	    };

	    return cartService;
	});

	app.run(function(cart) {
	  cart.load();
	});


	app.controller('StoreController', function($http, $scope, cart){
		var store = this;
		$scope.chunkedData = [];

		$http.get('/api/products' ).success(function(data){
			$scope.chunkedData = chunk(data, 3);
		});

		this.cartToggle = function (product) {
			if (!cart.inCart(product)) {		// if not found -> add
				product.inCart = true;
				cart.add(product);
				console.log(product.name + " added to cart");
			} else {															// if found -> remove
				product.inCart = false;
				cart.remove(product);
				console.log(product.name + " removed from cart");
			}
		};

	});

	app.controller('cartController', function($scope, $http, cart) {
		var cartCtrl = this;
		cartCtrl.cart = [];

		cartCtrl.total = 0;
		cartCtrl.count = 0;

		$http.get('/api/cart').success(function (data) {
			cartCtrl.cart = data;
			for (var i = 0; i < data.length; i++) {
				cartCtrl.count++;
				cartCtrl.total += data[i].price;
			}
		});

		this.removeFromCart = function (product) {
			if (cart.inCart(product)) {
				product.inCart = false;

				// remove from (global) cartService cart
				cart.remove(product);

				// remove from controller's cart
				for (var i = 0; i < cartCtrl.cart.length; i++) {
					if (cartCtrl.cart[i]._id === product._id) {
						cartCtrl.cart.splice(i, 1);
						break;
					}
				}

				//update cart total and item count
				cartCtrl.count--;
				cartCtrl.total -= product.price;

				console.log(product.name + " removed from cart");
			}
		};
  });

	function chunk(arr, size) {
	  var newArr = [];
	  for (var i=0; i<arr.length; i+=size) {
	    newArr.push(arr.slice(i, i+size));
	  }
	  return newArr;
	}

	jQuery.fn.highlight = function() {
   $(this).each(function() {
        var el = $(this);
        el.before("<div/>")
        el.prev()
            .width(el.width())
            .height(el.height())
            .css({
                "position": "absolute",
                "background-color": "#ffff99",
                "opacity": ".9"
            })
            .fadeOut(500);
    });
	}

})();
