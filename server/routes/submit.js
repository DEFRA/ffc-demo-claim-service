const schema = require('../schema/claim')
const claimService = require('../services/claim-service')

module.exports = {
  method: 'POST',
  path: '/submit',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        console.log(`rejected payload ${request.payload}`)
        return h.response().code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const messageService = await require('../services/message-service')
      console.log('new claim received')
      const claim = await claimService.create(request.payload, await messageService.publishClaim)
      return h.response(claim).code(200)
    }
  }
}
