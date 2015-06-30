var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProductSchema = new Schema({
    name: String,
    price: Number,
    stars: Number,
    image: String,
    description: String,
    reviews: [{ stars: Number, body: String, author: String, createdAt: Date }]
});

module.exports = mongoose.model('Product', ProductSchema);