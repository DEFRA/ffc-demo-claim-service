module.exports = {
  method: 'GET',
  path: '/error',
  options: {
    handler: async (request, h) => {
      throw new Error()
      // return h.response('').code(500)
    }
  }
}
