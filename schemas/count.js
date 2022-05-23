const mongoose = require('mongoose')

const Schema = mongoose.Schema({
  countId: {
    type: String,
    required: true,
    unique: true,
  },
  counts: {
    type: Number,
    required: true,
    default: 0,
  },
  
})

module.exports = mongoose.model('count', Schema)