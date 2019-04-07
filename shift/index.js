const service = require('./service');
const Joi = require('joi');

exports.register = (server) => {
  server.route({
    method: 'POST',
    path: '/',
    config: {
      auth: 'simple',
      validate: {
        payload: {
          start: Joi.date().iso().max('now').required(),
          end: Joi.date().iso().min(Joi.ref('start')).max('now').required()
        }
      }
    },
    handler: async (request, h) => {

      const start = request.payload.start;
      const end = request.payload.end;

      await service.save({
        start: start,
        end: end,
        username: request.auth.credentials.username
      });

      let hours = ((end.valueOf() - start.valueOf())/1000/60/60).toFixed(2);

      return h.response({
        message: `Thank you for entering your shift. Your shift was ${hours} hours`
      }).code(201);
    }
  });
};

exports.pkg = {
  name: "manager"
};