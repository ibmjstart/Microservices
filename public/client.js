(function(){
	var app = angular.module('store', ['store-products', 'ngRoute']);

	// configure our routes
	app.config(function($routeProvider) {
        $routeProvider
				
            // route for the home page
            .when('/', {
                templateUrl : 'home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/cart', {
                templateUrl : 'cart.html',
                controller  : 'cartController'
            })
    });

	app.controller('StoreController', [ '$http', '$scope', function($http, $scope){
		var store = this;
		store.products = [];
		$scope.chunkedData = [];

		$http.get('/api/products' ).success(function(data){
			store.products = data;
			$scope.chunkedData = chunk(data, 3);
		});
	}]);

	app.controller('mainController', function($scope) {
      // create a message to display in our view
      $scope.message = 'Everyone come and see how good I look!';
  });

	app.controller('cartController', function($scope) {
      $scope.message = 'Look! I\'m a cart!';
  });

	function chunk(arr, size) {
	  var newArr = [];
	  for (var i=0; i<arr.length; i+=size) {
	    newArr.push(arr.slice(i, i+size));
	  }
	  return newArr;
	}

})();
