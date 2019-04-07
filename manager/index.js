exports.register = (server, options) => {

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'session'
    },
    handler: (request, h) => {

      const data = await service.findAll();

      return h.view('shift/list.html', {
        shifts: data
      });
      
    }
  });

};

exports.pkg = {
  name: "manager"
};