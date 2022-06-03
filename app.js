const express = require('express')
const connect = require('./schemas')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { swaggerUi, specs } = require('./swagger/swagger')
const app = express()
const port = 4000

connect()

const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')
const usersRouter = require('./routes/users')

const requestMiddleware = (req, res, next) => {
  console.log(req.originalUrl, new Date())
  next()
}

app.use(cors())
app.use(express.static('static'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
// app.use(requestMiddleware)

app.use('/posts', postsRouter)
app.use('/posts', commentsRouter)
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(port, '포트 실행')
})

module.exports = app
