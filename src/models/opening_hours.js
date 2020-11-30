const mongoose = require('mongoose');
const { Schema } = mongoose;

const OpeningHours = new Schema({
  shop_id: Number,
  mon: {
    open: String,
    close: String
  },
  tue: {
    open: String,
    close: String
  },
  wed: {
    open: String,
    close: String
  },
  thu: {
    open: String,
    close: String
  },
  fri: {
    open: String,
    close: String
  },
  sat: {
    open: String,
    close: String
  },
  sun: {
    open: String,
    close: String
  }
})

// Export the model
module.exports = mongoose.model('opening_hours', OpeningHours);