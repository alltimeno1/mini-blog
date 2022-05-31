const request = require('supertest')
const { expect } = require('chai')
const app = require('../app')
const Users = require('../schemas/user')
const validateUser = require('../schemas/validate_user')
const fs = require('fs')

const jsonFile = fs.readFileSync('test/users.json', 'utf8')
const cases = JSON.parse(jsonFile)

app.post('/test/users/new', async (req, res) => {
  const { nickname, password, confirmPassword } = req.body
  const schema = validateUser(nickname)

  try {
    await schema.validateAsync({ nickname, password, confirmPassword })

    const user = await Users.findOne({ nickname })

    if (user) {
      return res.status(400).json({ message: '중복된 닉네임입니다.' })
    }

    return res.json({ nickname, password, confirmPassword })
  } catch (error) {
    return res.status(400).json({ message: '닉네임과 비밀번호 규칙을 지켜주세요!', error })
  }
})

describe('POST /test/users/new', () => {
  const req = request.agent(app)

  cases.forEach((testCase) => {
    const { message, nickname, password, confirmPassword, statusCode } = testCase

    it(message, async () => {
      const res = await req.post('/test/users/new').send({ nickname, password, confirmPassword })

      expect(res.statusCode).to.equal(statusCode)

      if (res.body.message) {
        console.log(message, '\n', res.body.message)
      }
    })
  })
})
