const express = require('express')
const jwt = require('jsonwebtoken')
const Users = require('../schemas/user')
const router = express.Router()
const validateUser = require('../schemas/validate_user')
require('dotenv').config()

/**
 * @swagger
 *
 * /users/auth:
 *  post:
 *    summary: 로그인
 *    description: POST 방식으로 로그인
 *    tags: [Users]
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: body
 *      description: 아이디와 패스워드 입력
 *      required: true
 *      schema:
 *        type: object
 *        required:
 *        - nickname
 *        - password
 *        properties:
 *           nickname:
 *             type: string
 *             description : 아이디
 *           password:
 *             type: string
 *             description : 비밀번호
 *      responses:
 *       200:
 *        description: 로그인 성공
 *       400:
 *        description: 로그인 실패
 */
router.post('/auth', async (req, res) => {
  const { nickname, password } = req.body

  const user = await Users.findOne({ nickname, password }).exec()

  if (!user) {
    return res.status(400).json({ message: '닉네임 또는 패스워드를 확인해주세요.' })
  }

  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY)
  console.log(token)
  res.cookie('authorization', 'Bearer ' + token, {
    expires: new Date(Date.now() + 1800000),
  })
  res.send('<a href="/posts">게시글 링크</a>')
})

router.post('/new', async (req, res) => {
  const { nickname, password, confirmPassword } = req.body
  const schema = validateUser(nickname)

  try {
    await schema.validateAsync({ nickname, password, confirmPassword })

    const user = await Users.findOne({ nickname }).exec()

    if (user) {
      return res.status(400).json({ message: '중복된 닉네임입니다.' })
    }

    await Users.create({ nickname, password })

    return res.json({ message: '회원 가입이 완료되었습니다.' })
  } catch (error) {
    return res.status(400).json({ message: '닉네임과 비밀번호 규칙을 지켜주세요!', error })
  }
})

module.exports = router
