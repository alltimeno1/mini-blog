const Joi = require('joi')

module.exports = function validateUser(nickname) {
  return Joi.object({
    nickname: Joi.string().alphanum().min(3).required(),
    password: Joi.string()
      .custom((value, helpers) =>
        value.includes(nickname) ? helpers.error('invalid password') : value
      )
      .min(4)
      .required(),
    confirmPassword: Joi.ref('password'),
  })
}
