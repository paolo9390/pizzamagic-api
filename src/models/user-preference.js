const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserPreference = new Schema({
shop_id:  String, // String is shorthand for {type: String}
fulfillment_method: {
    type: String,
    required: false,
    trim: true
},
address_id: String
})

// Export the model
module.exports = mongoose.model('userPreference', UserPreference);