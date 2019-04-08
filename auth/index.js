const service = require('./service');

exports.register = async function (server) {

  await server.register(require('bell'));
  await server.register(require('hapi-auth-basic'));
  await server.register(require('hapi-auth-cookie'));

  server.auth.strategy('simple', 'basic', {
    validate: service.validate
  });

  server.auth.strategy('azure', 'bell', {
    provider: 'azuread',
    password: 'cookie_encryption_password_secure',
    clientId: 'a6f2f7c7-662f-4de8-8466-63e4dc3ce9dc',
    clientSecret: 'E2jaen07cWGBzJ5nMPGxs6Myc+z483996/ey4OTQUhU=',
    config: {
      tenant: 'f90a3c58-a777-489e-a4a4-226105ba5b30'
    },
    isSecure: false
  });

  server.auth.strategy('session', 'cookie', {
    password: 'password-should-be-32-characters',
    redirectTo: '/',
    appendNext: true,
    isSecure: false
  });

  server.route({
    method: 'GET',
    path: '/azure/login',
    options: {
      auth: 'azure',
      handler: function (request, h) {

        if (!request.auth.isAuthenticated) {
          return `Authentication failed due to: ${request.auth.error.message}`;
        }

        request.cookieAuth.set({
          username: request.auth.credentials.profile.email
        });

        const next = request.auth.credentials.query.next ?
          request.auth.credentials.query.next : '/home';

        return h.redirect(next);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/logout',
    config: {
      auth: 'session',
    },
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  });
};

exports.pkg = {
  name: 'auth'
};