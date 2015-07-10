(function(){
  var app = angular.module('cart', []);

  app.factory('cart', function($http, $rootScope) {
	    var cart = [];
	    var cartService = {};

			cartService.load = function () {
				$http.get(cartApi + '/api/cart').success(function (data) {
					cart = data;
				});
			};

	    cartService.add = function(product) {
	      cart.push(product);
        $rootScope.cartCount++;

				// update db
				$http.put(cartApi + '/api/products/'+product._id, { inCart: true });
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
          $rootScope.cartCount--;
					cart.splice(index, 1);
					$http.put(cartApi + '/api/products/'+product._id, { inCart: false });
				}
			};

	    cartService.list = function() {
	        return cart;
	    };

	    return cartService;
	});

  app.controller("CheckoutController", function($http){
    var checkout = this;
    checkout.payment = {};
    this.sendPayment = function(payment, form) {
      $http.put(cartApi + '/api/checkout/verifyPayment', payment).success(function(res){
        if (res.status === "verified") {
          form.$setPristine(true);
          checkout.payment = {};
          toastr.success('Thank you for your purchase!', 'Order Completed');
        } else if (res.status === "expired") {
          checkout.payment.month = '';
          checkout.payment.year = '';
          toastr.error('Please use an un-expired gift card.', 'Card is expired');
        } else {
          toastr.error('Please try agin later.', 'Server Error');
        }
      });

    };
  });

  app.controller('cartController', function($scope, $http, cart) {
		var cartCtrl = this;
		cartCtrl.cart = [];

		cartCtrl.total = 0;
		cartCtrl.count = 0;

		$http.get(cartApi + '/api/cart').success(function (data) {
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

  app.directive('cartTables', function(){
    return {
      restrict: 'E',
      templateUrl: 'cart/cart-tables.html'
    }
  });

  app.directive('checkout', function(){
    return {
      restrict: 'E',
      templateUrl: 'cart/checkout.html'
    }
  });

  // for the pop up that comes up after a order is submitted
  toastr.options = {
	  "positionClass": "toast-bottom-full-width",
	  "timeOut": "10000",
	}

})();
