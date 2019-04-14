const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const createServer = require('../server')
const proxyquire = require('proxyquire').noCallThru()

lab.experiment('API test', () => {
  let server

  // Create server before each test
  lab.before(async () => {
    server = await createServer()
  })

  lab.test('POST / route works', async () => {
    const options = {
      method: 'POST',
      url: '/submit',
      payload: {
        claimId: 'MINE123',
        propertyType: 'business',
        accessible: false,
        dateOfSubsidence: new Date(),
        mineType: ['gold', 'iron']
      }
    }

    // TODO mock repository layer

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })
})
