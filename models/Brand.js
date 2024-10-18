const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  brandName: {
    type: String,
    requires: true,
    unique: true
  },
});

module.exports = mongoose.model('Brand', brandSchema);
