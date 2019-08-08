const routes = [].concat(
  require('../routes/submit'),
  require('../routes/error')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
