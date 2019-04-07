const Joi = require('joi');

exports.register = (server, options) => {
// Add shift route
server.route({
  method:'POST',
  path:'/shift',
  config: {
    validate: {
      payload: {
        start: Joi.date().iso().max('now').required(),
        end: Joi.date().iso().min(Joi.ref('start')).max('now').required()
      },
      // failAction: (request, h, error) => {
      //   throw error;
      // }
    }
  },
  handler: (request, h) => {
    return request.payload
  }
});
}
exports.pkg = {
   name: 'employee'
};
