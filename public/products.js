(function(){
	var app = angular.module('store-products', []);

	app.controller("ReviewController", function(){
		this.review = {};
		this.addReview = function(product) {
			this.review.createdOn = Date.now();
			product.reviews.push(this.review)
			this.review = {};
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
