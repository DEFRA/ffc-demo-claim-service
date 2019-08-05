const processErrorResponse = require('./process-error-response')

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        return request.response.isBoom ? processErrorResponse(request) : h.continue
      })
    }
  }
}
