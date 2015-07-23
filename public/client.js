(function(){
	var app = angular.module('store', ['products', 'cart', 'reviews', 'ngRoute']);

	// configure our routes
	app.config(function($routeProvider) {
      $routeProvider

      // route for the home page
      .when('/', {
          templateUrl  : 'products/store.html',
					controller   : 'productController',
					controllerAs : 'store'
      })

      // route for the about page
      .when('/cart', {
          templateUrl  : 'cart/cart.html',
          controller   : 'cartController',
					controllerAs : 'cartCtrl'
      })
  });

	app.run(function(cart) {
	  cart.load();
	});

	app.controller("HeaderController", function($http, $rootScope, $scope){
		$rootScope.cartCount = 0;
		$http.get(cartApi + '/api/cart/count').success(function(res){
			$rootScope.cartCount = res.count;
		});
  });

	app.directive('storeHeader', function(){
		return {
			restrict: 'E',
			templateUrl: 'store-header.html',
			controller: 'HeaderController',
			controllerAs: 'headerCtrl'
		}
	});

})();
