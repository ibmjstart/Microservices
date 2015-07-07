(function(){
	var app = angular.module('store-products', []);

	app.controller("ReviewController", function($http, $scope){
		reviewCtrl = this;
		$scope.reviews = [];
		$http.get('/api/reviews/559c102dc48f5a7249000002').success(function(data){
			$scope.reviews = data;
		});
		reviewCtrl.review = {};
		this.addReview = function(product) {
			reviewCtrl.review.createdOn = Date.now();
			debugger;
			$http.put('/api/reviews/' + product._id, reviewCtrl.review);
			reviewCtrl.review = {};
		};
	});

	app.directive('product', function(){
		return {
			restrict: 'E',
			templateUrl: 'product.html'
		}
	});

	app.directive('productReviews', function(){
		return {
			restrict: 'E',
			templateUrl: 'product-reviews.html'
		}
	});

	app.directive('productTabs', function(){
		return {
			restrict: 'E',
			templateUrl: 'product-tabs.html',
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

})();
