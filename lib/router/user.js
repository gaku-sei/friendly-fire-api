'use strict';

const Router = require('koa-router');
const friends = require('./friends');

const user = module.exports = new Router();

user.get('settings.show', '/settings', function *(next) {});
user.patch('settings.edit', '/settings', function *(next) {});

user.use('/friends', friends.routes());
