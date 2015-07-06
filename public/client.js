(function(){
	var app = angular.module('store', ['store-products', 'ngRoute']);

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
		store.products = [];
		$scope.chunkedData = [];

		$http.get('/api/products' ).success(function(data){
			store.products = data;
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
		var contents = this;
		contents.cart = [];

		$http.get('/api/cart').success(function (data) {
			contents.cart = data;
		});

    $scope.message = 'Look! I\'m a cart!';

		this.removeFromCart = function (product) {
			if (cart.inCart(product)) {
				product.inCart = false;

				// remove from (global) cartService cart
				cart.remove(product);

				// remove from controller's cart
				for (var i = 0; i < contents.cart.length; i++) {
					if (contents.cart[i]._id === product._id) {
						contents.cart.splice(i, 1);
						break;
					}
				}
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

})();
