const Router = require('koa-router');
const users = require('./users');
const session = require('./session');

const router = module.exports = new Router();

router.use('/users', users.routes());
router.use('/session', session.routes());
