const Router = require('koa-router');

const conversations = module.exports = new Router();

conversations.get('conversations.all', '/', function *(next) {});
conversations.post('conversations.create', '/', function *(next) {});
conversations.get('conversations.show', '/:id', function *(next) {});
conversations.patch('conversations.edit', '/:id', function *(next) {});
conversations.delete('conversations.delete', '/:id', function *(next) {});
