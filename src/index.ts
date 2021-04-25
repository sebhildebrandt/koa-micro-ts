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

import koaBody from 'koa-body';
import gracefulShutdown, { Options } from 'http-graceful-shutdown';
import helmet from 'koa-helmet';
import Router from '@koa/router';
import serve = require('koa-static')
import { HttpStatusCode } from './httpStatus'
import { KoaErrors } from './error.interface'
import cors from './cors';
import { Logger, LogLevels, iLogOptions } from './log';
import parseArgs from './args';
import jwt from './jwt';
import { autoRoute } from './autoRoute';
import * as validators from './validators';
import Application from 'koa';

class KoaMicro extends Application {

  constructor() {
    super();
    this.development = (process.env && process.env.DEVELOPMENT) ? true : false;
  }
  helmet = () => {
    this.use(helmet());
  }

  gracefulShutdown = (options = {}) => {
    gracefulShutdown(app, options);
  }

  static = (path: string) => {
    this.use(serve(path));
  }

  health = (path?: string, option?: any) => {
    path = path || '/health';
    const router = new Router({
      prefix: path
    });

    router.get('/', (ctx) => {
      const status: any = {};
      if (process.env.APP_NAME) { status.name = process.env.APP_NAME; }
      if (option && option.name) { status.name = option.name; }
      if (process.env.APP_VERSION) { status.version = process.env.APP_VERSION; }
      if (option && option.version) { status.version = option.version; }
      status.status = 'ok';
      ctx.body = status;
    });

    this
      .use(router.routes())
      .use(router.allowedMethods());
  }

  newRouter = (prefix?: string) => {
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

  log = new Logger({
    level: LogLevels.none
  });

  autoRoute = (routepath: string, mountpoint?: string, auth?: boolean) => {
    mountpoint = mountpoint || '';
    auth = auth || false;
    autoRoute(this, routepath, mountpoint, auth);
  }

  logger(options: iLogOptions) {
    this.log = new Logger(options);
    if (this.log.logLevel() >= LogLevels.info) {
      app.use(this.logMiddleware())
    }
    return this.log;
  }

  args: any = {};

  development: boolean;

  private catchErrorsFn = async (ctx: any, next: any) => {
    try {
      await next();
    } catch (err) {
      if (err === null) {
        err = {};
      }
      const status = err.status || 500;
      const code = err.code || -1;
      const message = err.message || 'Error';
      const description = err.description || '';

      this.log.error(`Status: ${status}, Code: ${code}, Message: ${message}, Description: ${description}`);
      ctx.status = status;
      ctx.type = 'application/json';
      ctx.body = JSON.stringify({
        status,
        code,
        message,
        description
      });
    }
  }

  private logMiddleware() {
    function time(start: number) {
      const delta = Date.now() - start;
      return delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's'
    }

    function len(ctx: any) {
      let result = '';
      if (![204, 205, 304].includes(ctx.status) && ctx.length) {
        result += ctx.length + ' Bytes';
      }
      return result;
    }

    return async (ctx: any, next: any) => {

      const start = ctx[Symbol.for('request-received.startTime')]
        ? ctx[Symbol.for('request-received.startTime')].getTime()
        : Date.now();


      try {
        this.log.info(`  <-- ${ctx.method} ${ctx.originalUrl}`)
        await next();
        this.log.info(`  --> ${ctx.method} ${ctx.originalUrl} ${ctx.status || 500} ${time(start)} ${len(ctx)}`)
      } catch (err) {
        this.log.info(`  xxx ${ctx.method} ${ctx.originalUrl} ${err.status || 500} ${time(start)}`)
        throw err;
      }
    }
  }

  catchErrors() {
    this.use(this.catchErrorsFn);
  }
  parseArgs(alias?: any) {
    this.args = parseArgs(alias);
    if (this.args.development || this.args.dev) {
      this.development = true;
    }
  }
}
namespace KoaMicro {
  export class KoaMicro { }
}

// let app: KoaMicro | null = null;

// if (!app) {
//   app = new KoaMicro();
// }
const app = new KoaMicro();

app.use(koaBody());

export {
  app,
  LogLevels,
  validators,
  Application,
  KoaMicro,
  HttpStatusCode,
  KoaErrors
}
