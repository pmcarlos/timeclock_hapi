jest.mock('../../src/shift/service.js');
jest.mock('sequelize');
const service = require.requireMock('../../src/shift/service.js');
const Joi = require('joi');

const it = test;

var route;
var server;
var request;
var h;
var code;

describe('the plugin', () => {
  const uut = require('../../src/shift/index');

  describe('when register', () => {
    beforeEach(() => {
      server = {
        route: jest.fn()
      }

      uut.register(server);
    });

    describe('the first route', () => {
      beforeEach(() => {
        route = server.route.mock.calls[0][0];
      })
    });

    describe('the second route', () => {
      beforeEach(() => {
        route = server.route.mock.calls[1][0];
      })

      it('has a method of "POST"', () => {
        expect(route.method).toEqual('POST');
      })

      it('has a path of "/"', () => {
        expect(route.path).toEqual('/');
      })

      it('has an auth strategy of "simple"', () => {
        expect(route.config.auth).toEqual('simple');
      })

      describe('the payload', () => {
        it('has a required start date', () => {
          const expected = Joi.describe(Joi.date().iso().max('now').required())
          const actual = Joi.describe(route.config.validate.payload.start)

          expect(actual).toEqual(expected)
        })

        it('has a required end date', () => {
          const expected = Joi.describe(Joi.date().iso().min(Joi.ref('start')).max('now').required())
          const actual = Joi.describe(route.config.validate.payload.end)

          expect(actual).toEqual(expected)
        })
      })

      describe('the handler', () => {
        describe('when called', () =>{
          beforeEach(() => {
            request = {
              payload: {
                start: '2019-04-01',
                end: '2019-04-02'
              },
              auth: {
                credentials: {
                  username: 'username'
                }
              },
              log: jest.fn()
            }

            code = jest.fn()

            h = {
              response: jest.fn().mockReturnValue({
                code
              })
            }

            route.handler(request, h)
          })

          it('saves information into the service', () => {
            expect(service.save.mock.calls.length).toEqual(1)
          })

          describe('the save call', () => {
            var call

            beforeEach(() => {
              call = service.save.mock.calls[0]
            })

            it('passes the given start date to the service', () => {
              expect(call[0].start).toEqual('2019-04-01')
            })

            it('passes the given end date to the service', () => {
              expect(call[0].end).toEqual('2019-04-02')
            })

            it('passes the authenticated username to the service', () => {
              expect(call[0].username).toEqual('username')
            })

            it('responds with 201 status code', () => {
              expect(code.mock.calls[0][0]).toEqual(201)
            })

            it('responds with a succes message', () => {
              expect(h.response.mock.calls[0][0].message).toEqual('Thank you for entering your shift. Your shift was NaN hours')
            })
          })
        })
      })
    });

    describe('the third route', () => {
      beforeEach(() => {
        route = server.route.mock.calls[2][0]
      })

      it('has a method of "POST"', () => {
        expect(route.method).toEqual('POST');
      })

      it('has a path of "/{id}/approve"', () => {
        expect(route.path).toEqual('/{id}/approve');
      })

      it('has an auth strategy of "session"', () => {
        expect(route.config.auth).toEqual('session');
      })

      describe('the handler', () => {
        describe('when called', () => {
          beforeEach(() => {
            service.update.mockClear()

            request = {
              params: {
                id: '123'
              },
              auth: {
                credentials: {
                  username: 'username'
                }
              }
            }

            h = {
              redirect: jest.fn()
            }

            route.handler(request, h)
          })

          it('updates the shift', () => {
            expect(service.update.mock.calls.length).toEqual(1)
          })

          describe('the update call', () => {
            var call

            beforeEach(() => {
              call = service.update.mock.calls[0]
            })

            it('passes id to the service', () => {
              expect(call[0].id).toEqual('123')
            })

            it('passes the reviewer to the service', () => {
              expect(call[0].reviewer).toEqual('username')
            })

            it('passes state of approved to the service', () => {
              expect(call[0].state).toEqual('approved')
            })

            it('redirects to "/shift"', () => {
              expect(h.redirect.mock.calls[0][0]).toEqual('/shift')
            })
          })
        })
      })
    })

    describe('the fourth route', () => {
      beforeEach(() => {
        route = server.route.mock.calls[3][0]
      })

      it('has a method of "POST"', () => {
        expect(route.method).toEqual('POST');
      })

      it('has a path of "/{id}/reject"', () => {
        expect(route.path).toEqual('/{id}/reject');
      })

      it('has an auth strategy of "session"', () => {
        expect(route.config.auth).toEqual('session');
      })

      describe('the handler', () => {
        describe('when called', () => {
          beforeEach(() => {
            service.update.mockClear()

            request = {
              params: {
                id: '123'
              },
              auth: {
                credentials: {
                  username: 'username'
                }
              }
            }

            h = {
              redirect: jest.fn()
            }

            route.handler(request, h)
          })

          it('updates the shift', () => {
            expect(service.update.mock.calls.length).toEqual(1)
          })

          describe('the update call', () => {
            var call

            beforeEach(() => {
              call = service.update.mock.calls[0]
            })

            it('passes id to the service', () => {
              expect(call[0].id).toEqual('123')
            })

            it('passes the reviewer to the service', () => {
              expect(call[0].reviewer).toEqual('username')
            })

            it('passes state of rejected to the service', () => {
              expect(call[0].state).toEqual('rejected')
            })

            it('redirects to "/shift"', () => {
              expect(h.redirect.mock.calls[0][0]).toEqual('/shift')
            })
          })
        })
      })
    })
  });
});