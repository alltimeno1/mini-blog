const mongoose = require('mongoose')

const connect = () => {
  mongoose.connect('mongodb://localhost:27017/local', { ignoreUndefined: true})
    .then(() => console.log('success'))
    .catch((err) => {
      console.log(err)
  })
}

module.exports = connect