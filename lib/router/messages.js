'use strict';

const Router = require('koa-router');
const messages = module.exports = new Router();
const middlewares = require('../helpers/middlewares');

messages.use('/', middlewares.auth(), middlewares.injectModel({Message: 'message'}));

messages.get('messages.all', '/', function *() {
  this.body = yield this.state.Message.find({
    conversation: this.params.conversationId
  });
});

messages.post('messages.create', '/', function *() {
  this.body = yield this.state.Message.create(Object.assign(this.request.body, {
    conversation: this.params.conversationId
  }));
});
