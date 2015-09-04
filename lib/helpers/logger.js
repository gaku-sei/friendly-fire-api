const bunyan = require('bunyan');
const router = require('../router');

const log = bunyan.createLogger({name: 'FrienlyFire'});

exports.error = (err, ctx) => {
  log.error(err);
  log.debug(ctx);
};

exports.routes = () => {
  log.info(router.routes().router.stack.map(route => ({
    methods: route.methods,
    name: route.name,
    path: route.path
  })));
};
