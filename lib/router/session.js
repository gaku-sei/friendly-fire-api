const Router = require('koa-router');
const util = require('../helpers/util');
const middlewares = require('../helpers/middlewares');

const session = module.exports = new Router();

session.post('/', middlewares.model({User: 'user'}), function *() {
  const user = yield this.state.User.findOne({email: this.request.body.email});
  if(user && user.password === util.encrypt(this.request.body.password)) {
    this.body = this.session.user = user;
  } else {
    this.throw(400, 'Wrong credentials');
  }
});
