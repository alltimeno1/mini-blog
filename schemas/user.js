const mongoose = require('mongoose')

const Schema = mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

Schema.virtual("userId").get(function () {
  return this._id.toHexString();
});

Schema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model('user', Schema)