'use strict';

const http = require('http');
const url = require('url');
const koa = require('koa');
const proxyquire = require('proxyquire');
const chai = require('chai');
const middlewares = proxyquire('../../lib/helpers/middlewares', {'./logger': {error: new Function()}});

chai.should();

const msg = 'Hello World', mainUrl = url.parse('http://localhost:3010');
const basicMiddleware = function *() {
  this.body = msg;
};

describe('middlewares', () => {
  let server, app;

  const launch = () => {
    server = http.createServer(app.callback()).listen(mainUrl.port);
  };

  beforeEach(() => app = koa());

  afterEach(() => server.close());

  describe('#errorHandler', () => {
    beforeEach(() => app.use(middlewares.errorHandler()));

    it('should raise the appropriate code error and message on error', done => {
      const error = new Error('I am a teapot');

      app.use(function *() {
        this.throw(418, error);
      });

      launch();

      http.get(mainUrl, res => {
        res.statusCode.should.equal(418);
        res.on('readable', () => {
          res.read().toString().should.equal(error.message);
          done();
        });
      }).on('error', err => { throw err; });
    });

    it('should include a WWW-Authenticate header on 401 errors', () => {
      app.use(function *() {
        this.throw(401, 'Not Authorized');
      });

      launch();

      http.get(mainUrl, res => {
        // toLowerCase is used thanks to: https://nodejs.org/api/http.html#http_message_headers
        res.headers.should.have.property('WWW-Authenticate'.toLowerCase()).that.equals('Basic');
      }).on('error', err => { throw err; });
    });
  });

  describe('#auth', () => {
    it('should raise a 401 error when user is not authenticated', () => {
      app.use(function *(next) {
        this.session = {};
        yield next;
      });

      app.use(middlewares.auth());

      launch();

      http.get(mainUrl, res => {
        res.statusCode.should.equal(401);
      }).on('error', err => { throw err; });
    });

    it('should pass and call the next middleware if user is authenticated', done => {
      app.use(function *(next) {
        this.session = {user: {name: 'test'}};
        yield next;
      });

      app.use(middlewares.auth());

      app.use(basicMiddleware);

      launch();

      http.get(mainUrl, res => {
        res.statusCode.should.equal(200);
        res.on('readable', () => {
          res.read().toString().should.equal(msg);
          done();
        });
      }).on('error', err => { throw err; });
    });
  });

  describe('#restrictContentType', () => {
    it(`should return a 400 error when the request Content-Type header is different
        from the provided type and the method is different from GET, HEAD and DELETE`);
    it('should pass and call the next middleware if the request is GET, HEAD or DELETE, whatever the Content-Type');
    it('should pass and call the next middleware if the Content-Type is similar to the provided type, whatever the method');
  });

  describe('#filterAcceptance', () => {
    it('should return a 406 error if the request Accept header does not contain the provided type(s)');
    it('should pass and call the next middleware if the request Accept header contains all of the provided type(s)');
  });

  describe('#injectModel', () => {
    it('should inject the request model in the state context');
  });

  describe('#injectService', () => {
    it('should inject the request service in the state context');
  });
});
