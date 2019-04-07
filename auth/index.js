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
    clientId: 'acaf8006-6c4a-47cf-908d-39e2dcb23250',
    clientSecret: '832oEQJGTOFwQ5TFXIuuwQDmliAFdlphUIqfz62rR6Y=',
    config: {
      tenant: '713149d8-674d-475a-9adb-8f7dac809039'
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