const Router = require('koa-router');
const user = require('./user');
const middlewares = require('../helpers/middlewares');

const users = module.exports = new Router();

users.use('/', middlewares.auth(), middlewares.model({User: 'user'}));

users.get('users.all', '/', function *() {
  this.body = yield this.state.User.find();
});

users.post('users.create', '/', function *() {
  this.body = yield this.state.User.create(this.request.body);
});

users.get('users.show', '/:id', function *() {
  this.body = yield this.state.User.findById(this.params.id);
});

users.patch('users.edit', '/:id', function *() {
  try {
    this.body = yield this.state.User.patch(this.params.id, this.request.body);
  } catch(e) {
    this.throw(400, e);
  }
});

users.delete('users.delete', '/:id', function *() {
  this.body = yield this.state.User.findByIdAndRemove(this.params.id);
});

users.use('/:id', user.routes());
