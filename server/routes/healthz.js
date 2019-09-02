module.exports = {
  method: 'GET',
  path: '/healthz',
  options: {
    handler: async (request, h) => {
      return h.response('ok').code(200)
    }
  }
}
