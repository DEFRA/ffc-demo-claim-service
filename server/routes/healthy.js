module.exports = {
  method: 'GET',
  path: '/healthy',
  options: {
    handler: async (request, h) => {
      return h.response('ok').code(200)
    }
  }
}
