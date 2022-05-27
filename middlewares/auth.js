const jwt = require('jsonwebtoken')
const Users = require('../schemas/user')
require('dotenv').config()

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.cookies
    const [tokenType, tokenValue] = authorization.split(' ')
    const url = req.originalUrl

    if (tokenType !== 'Bearer') {
      return res.status(401).send({
        message: '로그인이 필요합니다.',
      })
    }

    if (url === '/auth' || url === '/new') {
      return res.status(401).send({
        message: '이미 로그인이 되어있습니다.',
      })
    }

    const { userId } = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY)

    Users.findById(userId)
      .exec()
      .then((user) => {
        res.locals.user = user
        console.log('로그인 인증 완료')
        next()
      })
  } catch (error) {
    return res.status(401).send({
      message: '로그인이 필요합니다.',
    })
  }
}
