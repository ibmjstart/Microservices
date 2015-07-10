(function(){
	var app = angular.module('products', []);

	// this controller controlls the store and products
	app.controller('productController', function($http, $scope, cart, reviewService){
		var store = this;
		store.products = [];

		$http.get(productsApi + '/api/products' ).success(function(data){
			async.map(data, reviewService.addReviews, function(err, results){

				// we need to chunk for formatting in bootstrap rows
				store.products = chunk(results);
			});
		});

		this.cartToggle = function (product) {
			if (!cart.inCart(product)) {		// if not found -> add
				product.inCart = true;
				cart.add(product);
				
				console.log(product.name + " added to cart");
			} else {												// if found -> remove
				product.inCart = false;
				cart.remove(product);
				console.log(product.name + " removed from cart");
			}
		};

	});

	app.directive('product', function(){
		return {
			restrict: 'E',
			templateUrl: 'products/product.html'
		}
	});

	app.directive('productTabs', function(){
		return {
			restrict: 'E',
			templateUrl: 'products/product-tabs.html',
			controller: function(){
				this.tab = 1;

				this.selectTab = function(setTab){
					this.tab = setTab;
				};

				this.isSelected = function(checkTab){
					return this.tab === checkTab;
				}
			},
			controllerAs: 'panel'
		}
	});


	function chunk(arr) {
		var size = 3;
		var newArr = [];
		for (var i=0; i<arr.length; i+=size) {
			newArr.push(arr.slice(i, i+size));
		}
		return newArr;
	}

})();
