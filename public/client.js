(function(){
	var app = angular.module('store', ['store-products']);

	app.controller('StoreController', [ '$http', '$scope', function($http, $scope){
		var store = this;
		store.products = [];
		$scope.chunkedData = [];

		$http.get('/api/products' ).success(function(data){
			store.products = data;
			$scope.chunkedData = chunk(data, 3);
		});
	}]);


	function chunk(arr, size) {
	  var newArr = [];
	  for (var i=0; i<arr.length; i+=size) {
	    newArr.push(arr.slice(i, i+size));
	  }
	  return newArr;
	}


})();
