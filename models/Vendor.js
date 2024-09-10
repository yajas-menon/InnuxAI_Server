// models/Vendor.js
const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

module.exports = mongoose.model('Vendor', VendorSchema);
