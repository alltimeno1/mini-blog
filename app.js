const express = require('express')
const connect = require('./schemas')
const app = express()
const port = 3000

connect()

const Router = require('./routes/posts')

const requestMiddleware = (req, res, next) => {
  console.log(req.originalUrl, new Date())
  next()
}

app.use(express.static('views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestMiddleware)

app.use('/', Router)

app.listen(port, () => {
  console.log(port, '포트 실행')
})