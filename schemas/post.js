const mongoose = require('mongoose')

const Schema = mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    required: true,
    default: [],
  },
  postedDate: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model('post', Schema)
