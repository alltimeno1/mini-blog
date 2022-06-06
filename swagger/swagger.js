const swaggerUi = require('swagger-ui-express')
const swaggereJsdoc = require('swagger-jsdoc')

const options = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'mini-blog',
      description: '간단한 블로그 기능을 포함한 웹사이트 API',
    },
    host: '3.39.161.93:4000',
    basePath: '/',
  },
  apis: ['./routes/*.js', './swagger/*.yaml'], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }
