const Router = require('koa-router');

const friends = module.exports = new Router();

friends.get('friends.all', '/', function *(next) {});
friends.post('friends.create', '/', function *(next) {});
friends.get('friends.show', '/:id', function *(next) {});
friends.patch('friends.edit', '/:id', function *(next) {});
friends.delete('friends.delete', '/:id', function *(next) {});
