exports.register = (server, options) => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('manager/list.html', {
        test: 'this is a test'
      });
    }
  })
}

exports.pkg = {
  name: 'manager'
}