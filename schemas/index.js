const mongoose = require('mongoose')

const uri = 'mongodb://localhost:27017/local'

const connect = () => {
  mongoose
    .connect(uri, { ignoreUndefined: true })
    .then(() => console.log('success'))
    .catch((err) => {
      console.log(err)
    })
}

module.exports = connect
