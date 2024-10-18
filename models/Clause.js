// models/Clause.js
const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Clause', clauseSchema);
