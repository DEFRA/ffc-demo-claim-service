const routes = [].concat(
  require('../routes/error'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/submit')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
