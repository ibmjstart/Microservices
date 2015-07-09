var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProductSchema = new Schema({
    name: String,
    price: Number,
    stars: Number,
    image: String,
    description: String,
    inCart: Boolean
});

module.exports = mongoose.model('Product', ProductSchema);
