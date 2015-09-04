'use strict';

const mime = require('mime-types');
const path = require('path');
const logger = require('./logger');

const autoInject = root => injectors => {
  const obj = Object.keys(injectors).reduce((acc, key) =>
    (acc[key] = require(path.join('..', root, injectors[key])), acc), {});
  return function *(next) {
    Object.assign(this.state, obj);
    yield next;
  };
};

exports.errorHandler = () => function *(next) {
  try {
    yield next;
  } catch(e) {
    logger.error(e);
    switch(e.statusCode) {
      case 401: this.set('WWW-Authenticate', 'Basic');
    }
    this.status = e.statusCode;
    this.body = e.message;
  }
};

exports.auth = () => function *(next) {
  if(this.session.user) {
    yield next;
  } else {
    this.throw(401, new Error('You must sign in to access this URL'));
  }
};

exports.restrictContentType = ext => function *(next) {
  if(['GET', 'HEAD', 'DELETE'].includes(this.method) ||
     mime.extension(this.headers['content-type']) === (ext || 'json')) {
    yield next;
  } else {
    this.throw(400, new Error(`Content-Type must be of type ${ext}`));
  }
};

exports.filterAcceptance = types => function *(next) {
  if(this.accepts(types || 'json')) {
    yield next;
  } else {
    this.throw(406, new Error(`Client must accept this kind of response: ${types || 'json'}`));
  }
};

exports.injectModel = autoInject('models');
exports.injectService = autoInject('services');
