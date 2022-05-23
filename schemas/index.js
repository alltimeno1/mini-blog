const mongoose = require('mongoose')

const uri = `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@cluster0.zwbiy.mongodb.net/sparta?retryWrites=true&w=majority`

const connect = () => {
  mongoose.connect(uri, { ignoreUndefined: true})
    .then(() => console.log('success'))
    .catch((err) => {
      console.log(err)
  })
}

module.exports = connect