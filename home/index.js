exports.register = (server) => {
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: false,
        }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: 'index.html'
    }
  })
}
exports.pkg = {
  name: 'home'
}