const mongoose = require('mongoose');
const { Schema } = mongoose;

const Shop = new Schema({
  _id: Number,
  name: String,
  postcode: String,
  address: String,
  latitude: Number,
  longitude: Number,
  phone: String
})

// Export the model
module.exports = mongoose.model('shop', Shop);