'use strict';

const Router = require('koa-router');
const conversations = require('./conversations');
const middlewares = require('../helpers/middlewares');

const friends = module.exports = new Router();

friends.use('/', middlewares.auth(), middlewares.injectModel({User: 'user'}));

friends.get('friends.all', '/', function *() {
  const user = yield this.state.User.findById(this.params.userId).populate('friends');
  this.body = user.friends || [];
});

friends.post('friends.create', '/', function *() {
  yield this.state.User.findByIdAndUpdate(this.params.userId, {$push: {friends: this.request.body.friend}});
  this.body = yield this.state.User.findById(this.request.body.friend);
});

friends.get('friends.show', '/:id', function *() {
  const friend = yield this.state.User.findOne({_id: this.params.userId, friends: this.params.id});
  if(friend) {
    this.body = friend;
  } else {
    this.throw(404, 'User not found');
  }
});

friends.delete('friends.delete', '/:id', function *() {
  const friend = yield this.state.User.findOne({_id: this.params.userId, friends: this.params.id});
  yield this.state.User.findByIdAndUpdate(this.params.userId, {$pull: {friends: this.params.id}});
  this.body = friend;
});

friends.use('/:friendsId/conversations', conversations.routes());
