const mongoose = require('mongoose');
const { Schema } = mongoose;

const FulfillmentMethod = new Schema({
  shop_id: Number,
  name: String,
  label: String,
  asap: {
    label: String,
    display_label: String,
    range: String,
    selected_time: {
      day: String,
      time: String
    }
  },
  radius: Number,
  max_radius: Number,
  delivery_fee: Number,
  non_asap_minutes: Number
})

// Export the model
module.exports = mongoose.model('fulfillment_method', FulfillmentMethod);