'use strict';

const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const session = require('koa-generic-session');
const middlewares = require('./lib/helpers/middlewares');
const db = require('./lib/helpers/db');
const router = require('./lib/router');

const app = koa();

db.init('friendly-fire');

app.keys = ['simple', 'as', 'that'];

app.use(middlewares.errorHandler());

app.use(session());

app.use(cors({
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE']
}));

app.use(bodyParser());

app.use(middlewares.restrictContentType('json'));

app.use(middlewares.filterAcceptance('json'));

app.use(router.routes());

app.listen(process.env.PORT || 3000);
