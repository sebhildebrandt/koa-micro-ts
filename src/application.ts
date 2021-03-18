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
import gracefulShutdown, { Options } from 'http-graceful-shutdown';
import helmet from 'koa-helmet';
import Router from '@koa/router';
import serve = require('koa-static')
import cors from './cors';
import jwt from './jwt';
import { autoRoute } from './autoRoute';
import Application = require('koa');

class KoaMicro extends Application {

  constructor() {
    super();
  }
  helmet = () => {
    this.use(helmet());
  }

  gracefulShutdown = (options = {}) => {
    gracefulShutdown(app, options);
  }

  static = (path: string, mountpoint?: string) => {
    mountpoint = mountpoint || '';
    this.use(serve(path));
  }

  health = (path: string, option?: any) => {
    path = path || '/health';
    const router = new Router({
      prefix: path
    });

    router.get('/', (ctx) => {
      const status: any = {};
      if (process.env.APP_NAME) { status.name = process.env.APP_NAME; }
      if (option.name) { status.name = option.name; }
      if (process.env.APP_VERSION) { status.version = process.env.APP_VERSION; }
      if (option.version) { status.version = option.version; }
      status.status = 'ok';
      ctx.body = status;
    });

    this
      .use(router.routes())
      .use(router.allowedMethods());
  }

  newRouter = (prefix: string) => {
    return new Router({
      prefix
    });
  }
  useRouter = (router: Router) => {
    this
      .use(router.routes())
      .use(router.allowedMethods());
  }

  cors = (options: any = {}) => {
    this.use(cors(options));
  }

  jwt = (options: any = {}) => {
    jwt.init(options);
    return jwt;
  }

  start = (port: number) => {
    this.listen(port)
  }

  autoRoute = (routepath: string, mountpoint?: string, auth?: boolean) => {
    mountpoint = mountpoint || '';
    auth = auth || false;
    autoRoute(this, routepath, mountpoint, auth);
  }
}

const app: any = new KoaMicro();

app.use(koaBody());

export {
  app
}
