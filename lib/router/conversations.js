'use strict';

const Router = require('koa-router');
const messages = require('./messages');
const middlewares = require('../helpers/middlewares');

const conversations = module.exports = new Router();

conversations.use('/', middlewares.auth(), middlewares.injectModel({Conversation: 'conversation'}));

conversations.get('conversations.all', '/', function *() {
  this.body = yield this.state.Conversation.find({
    sender: this.params.userId,
    recipient:  this.params.friendsId
  });
});

conversations.post('conversations.create', '/', function *() {
  this.body = yield this.state.Conversation.create(Object.assign(this.request.body, {
    sender: this.params.userId,
    recipient: this.params.friendsId
  }));
});

conversations.get('conversations.show', '/:id', function *() {
  const conversation = yield this.state.Conversation.findOne(this.params.id);
  if(conversation) {
    this.body = conversation;
  } else {
    this.throw(404, 'Conversation not found');
  }
});

conversations.delete('conversations.delete', '/:id', function *() {
  this.body = yield this.state.Conversation.findByIdAndRemove(this.params.id);
});

conversations.use('/:conversationId/messages', messages.routes());
