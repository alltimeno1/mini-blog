const Joi = require('joi')

module.exports = function validateUser(nickname) {
  return Joi.object({
    nickname: Joi.string().alphanum().min(3).required(),
    password: Joi.string()
      .custom((value, helpers) =>
        value.includes(nickname) ? helpers.error('비밀번호에 아이디 포함 금지') : value
      )
      .min(4)
      .required(),
    confirmPassword: Joi.ref('password'),
  })
}
