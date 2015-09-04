'use strict';

const Router = require('koa-router');
const user = require('./user');
const middlewares = require('../helpers/middlewares');
const util = require('../helpers/util');

const users = module.exports = new Router();

users.use('/', middlewares.auth(), middlewares.injectModel({User: 'user'}));

users.get('users.all', '/', function *() {
  this.body = yield this.state.User.find();
});

users.post('users.create', '/', function *() {
  this.body = yield this.state.User.create(Object.assign(this.request.body, {
    password: util.encrypt(this.request.body.password)
  }));
});

users.get('users.show', '/:id', function *() {
  const user = yield this.state.User.findById(this.params.id);
  if(user) {
    this.body = user;
  } else {
    this.throw(404, 'User not found');
  }
});

users.patch('users.edit', '/:id', function *() {
  this.body = yield this.state.User.patch(this.params.id, this.request.body);
});

users.delete('users.delete', '/:id', function *() {
  this.body = yield this.state.User.findByIdAndRemove(this.params.id);
});

users.use('/:userId', user.routes());
