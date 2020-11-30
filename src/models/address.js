const mongoose = require('mongoose');
const { Schema } = mongoose;

ObjectId = Schema.ObjectId;

const Address = new Schema({
  user_id: ObjectId,
  postcode: String,
  address: String,
  phone: String,
  notes: String
})

// Export the model
module.exports = mongoose.model('address_book', Address);