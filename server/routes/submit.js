const schema = require('../schema/claim')

module.exports = {
  method: 'POST',
  path: '/submit',
  options: {
    validate: { payload: schema,
      failAction: async (request, h, error) => {
        console.log(`rejected payload ${request.payload}`)
        return h.response().code(400)
      }
    },
    handler: async (request, h) => {
      console.log('new claim received')
      
      return h.response().code(200)
    }
  }
}
