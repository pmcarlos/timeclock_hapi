exports.register = (server, options) => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('manager/list.html', {
        hours: [
          {
            enteredBy: 'user1',
            hours: 40
          }
        ]
      });
    }
  })
}

exports.pkg = {
  name: 'manager'
}