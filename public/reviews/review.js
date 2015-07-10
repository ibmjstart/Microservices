(function(){
  var app = angular.module('reviews', []);

  app.factory('reviewService', ['$http', function($http) {
		var reviewServices = {};
		reviewServices.addReviews = function (product, callback) {
			$http.get(reviewApi + '/api/reviews/' + product._id).success(function(data){
				product.reviews = data;
				callback(null, product);
			});
		};

		return reviewServices;
	}]);

  app.controller("ReviewController", function($http, $scope){
		this.review = {};
		this.addReview = function(product) {
			product.reviews.push(this.review);
			this.review.productId = product._id;
			$http.post(reviewApi + '/api/reviews/' + product._id, this.review);
			this.review = {};
		};
	});


  app.directive('reviews', function(){
    return {
      restrict: 'E',
      templateUrl: 'reviews/reviews.html'
    }
  });


})();
