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

			$http.get('/api/cart').success(function (data) {
				cart = data;
			});

	    cartService.add = function(product) {
	        cart.push(product);
	    };

			cartService.remove = function (index) {
				cart.splice(index, 1);
			};

			cartService.find = function (id) {
					for (var i = 0; i < cart.length; i++) {
						if (cart[i]._id === id) {
							return i;
						}
					}
					return -1;
			};

	    cartService.list = function() {
	        return cart;
	    };

	    return cartService;
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
			var index = cart.find(product._id);
			if (index === -1) {		// if not found -> add
				cart.add(product);
				product.inCart = true;
				console.log(product.name + " added to cart");
			} else {							// if found -> remove
				cart.remove(index);
				product.inCart = false;
				console.log(product.name + " removed from cart");
			}

			// update db
			$http.put('/api/products/'+product._id, { inCart: product.inCart });
		};
	});

	app.controller('cartController', function($scope, cart) {
      $scope.message = 'Look! I\'m a cart!';
			this.cart = cart.list();
  });

	function chunk(arr, size) {
	  var newArr = [];
	  for (var i=0; i<arr.length; i+=size) {
	    newArr.push(arr.slice(i, i+size));
	  }
	  return newArr;
	}

})();
