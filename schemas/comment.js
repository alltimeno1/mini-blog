const mongoose = require('mongoose')

const Schema = mongoose.Schema({
  postId: {
    type: Number,
    required: true,
  },
  commentId: {
    type: Number,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('comment', Schema)
