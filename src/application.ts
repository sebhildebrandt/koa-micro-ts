'use strict';

// --------------------------------------------------------------------
//        ____  _                  __         _
//       / __ \| | _____   __ _   / / __ ___ (_) ___ _ __ ___
//      / / _` | |/ / _ \ / _` | / / '_ ` _ \| |/ __| '__/ _ \
//     | | (_| |   < (_) | (_| |/ /| | | | | | | (__| | | (_) |
//      \ \__,_|_|\_\___/ \__,_/_/ |_| |_| |_|_|\___|_|  \___/
//       \____/
//
//         TypeScript Microservice Framework - based on koa
//
// --------------------------------------------------------------------
// application.js - version 1.0
// --------------------------------------------------------------------

import koa from 'koa';
import koaBody from 'koa-body';
import gracefulShutdown from 'http-graceful-shutdown';
import helmet from 'koa-helmet';
import Router from '@koa/router';
import serve = require('koa-static')
import cors from './cors';
import jwt from './jwt';

const app: any = new koa();

app.use(koaBody());

app.helmet = () => {
  app.use(helmet());
}

app.gracefulShutdown = (options = {}) => {
  gracefulShutdown(app, options);
}

app.static = (path: string) => {
  app.use(serve(path));
}

app.health = (path: string) => {
  const router = new Router({
    prefix: path
  });

  router.get('/', (ctx) => {
    ctx.body = 'OK';
  });

  app
    .use(router.routes())
    .use(router.allowedMethods());
}

app.newRouter = (prefix: string) => {
  return new Router({
    prefix
  });
}
app.useRouter = (router: Router) => {
  app
    .use(router.routes())
    .use(router.allowedMethods());
}

app.cors = (options: any = {}) => {
  app.use(cors(options));
}

app.jwt = (options: any = {}) => {
  jwt.init(options);
  return jwt;
}

app.start = (port: number) => {
  app.listen(port)
}

export {
  app
}
