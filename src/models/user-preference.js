const mongoose = require('mongoose');
const { Schema } = mongoose;
ObjectId = Schema.ObjectId;

const UserPreference = new Schema({
    shop_id: Number, 
    fulfillment_method: {
        type: String,
        required: false,
        trim: true
    },
    address_id: ObjectId
})

// Export the model
module.exports = mongoose.model('user-preference', UserPreference);