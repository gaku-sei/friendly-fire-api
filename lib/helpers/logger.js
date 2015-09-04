'use strict';

const bunyan = require('bunyan');

const log = bunyan.createLogger({name: 'FrienlyFire'});

exports.error = e => log.error(e);

exports.routes = router => {
  log.info(router.routes().router.stack.map(route => ({
    methods: route.methods,
    name: route.name,
    path: route.path
  })));
};
