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

  server.route({
    method: 'POST',
    path: '/{id}/approve',
    config: {
      auth: 'session'
    },
    handler: async (request, h) => {

      await service.update({
        id: request.params.id,
        reviewer: request.auth.credentials.username,
        state: 'approved'
      });
      return h.redirect('/manager');
    }
  });

  server.route({
    method: 'POST',
    path: '/{id}/reject',
    config: {
      auth: 'session'
    },
    handler: async (request, h) => {

      await service.update({
        id: request.params.id,
        reviewer: request.auth.credentials.username,
        state: 'rejected'
      });
      return h.redirect('/manager');
    }
  });

};

exports.pkg = {
  name: "manager"
};