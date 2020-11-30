const mongoose = require('mongoose');
const { Schema } = mongoose;

const order = new Schema({
shop_id:  String, // String is shorthand for {type: String}
date: { type: Date, default: Date.now }
})

// Export the model
module.exports = mongoose.model('order', order);