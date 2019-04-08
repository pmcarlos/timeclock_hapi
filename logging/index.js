exports.register = async (server) => {
  const options = {
    includes: {
      request: ['headers', 'payload'],
      response: ['headers', 'payload']
    },
    ops: {
      interval: 1000
    },
    reporters: {
        myConsoleReporter: [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*', ops: '*' }]
            },
            {
                module: 'good-console'
            },
            'stdout'
        ],
        fileReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ response: '*' }]
        }, {
          module: 'white-out',
          args: [{
            authorization: 'censor',
          }, {root: 'headers'}]
        }, {
          module: 'good-squeeze',
          name: 'SafeJson'
        }, {
          module: 'good-file',
          args: ['log_file']
        }]
    }
  };

  await server.register({
    plugin: require('good'),
    options
  })
}

exports.pkg = {
  name: 'logging'
}