var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReviewSchema = new Schema({
    productId: String,
    stars: Number,
    body: String,
    author: String
});

module.exports = mongoose.model('Review', ReviewSchema);
