// --------------------------------------------------------------------
//  _                               _                      _
// | | _____   __ _       _ __ ___ (_) ___ _ __ ___       | |_ ___
// | |/ / _ \ / _` |_____| '_ ` _ \| |/ __| '__/ _ \ _____| __/ __|
// |   < (_) | (_| |_____| | | | | | | (__| | | (_) |_____| |_\__ \
// |_|\_\___/ \__,_|     |_| |_| |_|_|\___|_|  \___/       \__|___/
//
//    Koa TypeScript Microservice Framework - batteries included
//
// --------------------------------------------------------------------
// index.js - version 3.x
// --------------------------------------------------------------------

import Router from '@koa/router';
import { createReadStream } from 'fs';
import gracefulShutdown from 'http-graceful-shutdown';
import Application from 'koa';
import koaBody from 'koa-body';
import helmet from 'koa-helmet';
import { join } from 'path';
import { createHtml, healthDocObj, mergeDeep } from './apiDoc';
import { BodyParserOptions, FallbackOptions, KoaErrors, StaticServeOptions } from './app.interface';
import parseArgs from './args';
import { autoRoute } from './autoRoute';
import cors from './cors';
import { HttpStatusCode } from './httpStatus';
import jwt from './jwt';
import { iLogOptions, Logger, LogLevels } from './log';
import { serve } from './static';
import validators from './validators';


interface HealthOptions { livePath?: string, readyPath?: string, isReady?: any, name?: string, version?: string; };
class KoaMicro extends Application {

  private server: any;
  private staticPath: string;

  constructor() {
    super();
    this.development = (process.env?.DEVELOPMENT) ? true : false;
    this.staticPath = '';
  }

  ready = false;

  helmet = () => {
    this.use(helmet());
  };

  gracefulShutdown = (options = {}) => {
    gracefulShutdown(app, options);
  };

  static = (filePath: string, opts?: StaticServeOptions) => {
    this.staticPath = filePath;
    this.use(serve(filePath, opts));
  };

  apiDoc = '';

  apiDocObj: any = {};

  health = (options?: HealthOptions) => {
    const router = new Router();

    if (!options) { options = {}; }
    if (!options.livePath) { options.livePath = '/live'; }
    if (!options.readyPath) { options.readyPath = '/ready'; }
    router.get(options.livePath, (ctx) => {
      const status: any = {};
      if (process.env.APP_NAME) { status.name = process.env.APP_NAME; }
      if (options?.name) { status.name = options.name; }
      if (process.env.APP_VERSION) { status.version = process.env.APP_VERSION; }
      if (options?.version) { status.version = options.version; }
      status.check = 'liveness';
      status.status = 'up';
      status.resultcode = 200;
      ctx.body = status;
    });

    router.get(options.readyPath, async (ctx) => {
      const status: any = {};
      if (process.env.APP_NAME) { status.name = process.env.APP_NAME; }
      if (options?.name) { status.name = options.name; }
      if (process.env.APP_VERSION) { status.version = process.env.APP_VERSION; }
      if (options?.version) { status.version = options.version; }
      status.check = 'readyness';
      status.status = 'not ready';
      ctx.status = 503; // service unavailable
      if (options?.isReady) {
        let res = false;
        try {
          res = await options.isReady();
        } catch (e) {
          res = false;
        }
        if (res) {
          status.status = 'ready';
          ctx.status = 200;
        }
      } else if (this.ready) {
        status.status = 'ready';
        ctx.status = 200;
      }
      status.resultcode = ctx.status;
      ctx.body = status;
    });

    this
      .use(router.routes())
      .use(router.allowedMethods());
    if (this.apiDoc) {
      const healthDoc = healthDocObj(options.readyPath, options.livePath);
      // this.apiDocObj = { ...this.apiDocObj, ...healthDoc }
      this.apiDocObj = mergeDeep(this.apiDocObj, healthDoc);
    }
  };

  newRouter = (prefix?: string) => {
    return new Router({
      prefix
    });
  };
  useRouter = (router: Router) => {
    this
      .use(router.routes())
      .use(router.allowedMethods());
  };

  cors = (options: any = {}) => {
    this.use(cors(options));
  };

  jwt = (options: any = {}) => {
    jwt.init(options);
    return jwt;
  };

  start = (port: number) => {
    // if APIDox is enabled, add route
    if (this.apiDoc) {
      const router = new Router();
      router.get(this.apiDoc, async (ctx) => {
        ctx.status = 200;
        ctx.body = createHtml(this.apiDocObj);
      });
      this
        .use(router.routes())
        .use(router.allowedMethods());
    }

    // start server
    this.server = this.listen(port || 3000);
  };

  log = new Logger({
    level: LogLevels.none
  });

  autoRoute = async (routepath: string, mountpoint?: string, auth?: boolean) => {
    mountpoint = mountpoint ?? '';
    auth = auth ?? false;
    await autoRoute(this, routepath, mountpoint, auth);
  };

  logger(options: iLogOptions) {
    this.log = new Logger(options);
    if (this.log.logLevel() >= LogLevels.info) {
      app.use(this.logMiddleware());
    }
    return this.log;
  }

  args: any = {};

  development: boolean;

  private catchErrorsFn = async (ctx: any, next: any) => {
    try {
      await next();
    } catch (err: any) {
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
  };

  private logMiddleware() {
    function time(start: number) {
      const delta = Date.now() - start;
      return delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's';
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
        this.log.http(`  <-- ${ctx.method} ${ctx.originalUrl}`);
        await next();
        if (ctx.status < 400) {
          this.log.http(`  --> ${ctx.method} ${ctx.originalUrl} ${ctx.status || 500} ${time(start)} ${len(ctx)}`);
        } else {
          this.log.error(`  --> ${ctx.method} ${ctx.originalUrl} ${ctx.status || 500} ${time(start)} ${len(ctx)}`);
        }
      } catch (err: any) {
        this.log.error(`  xxx ${ctx.method} ${ctx.originalUrl} ${err.status || 500} ${time(start)}`);
        throw err;
      }
    };
  }

  private apiHistoryFallbackMiddleware(options?: FallbackOptions) {
    const staticPath = this.staticPath;
    return function (ctx: any, next: any) {
      if (ctx.method !== 'GET' && ctx.method !== 'HEAD') { return next(); }
      if (!ctx.headers || typeof ctx.headers.accept !== 'string') { return next(); }
      const parsedUrl = ctx.url;
      if (ctx.headers.accept.indexOf('application/json') >= 0) { return next(); }
      if (ctx.headers.accept.indexOf('text/html') === -1 || ctx.headers.accept.indexOf('*/*') === -1) { return next(); }
      if (parsedUrl.indexOf('.') !== -1) { return next(); }

      let ignore: any;
      if (options?.ignore && typeof options.ignore === 'string') {
        ignore = [options.ignore];
      } else {
        ignore = options ? options.ignore : null;
      }
      if (ignore?.length) {
        let found = false;
        ignore.forEach((item: string) => {
          if (parsedUrl.indexOf(item) !== -1) {
            found = true;
          }
        });
        if (found) { return next(); }
      }
      const redirectUrl = options?.index ? options.index : '/index.html';
      ctx.url = redirectUrl;

      // serve this file
      const src = createReadStream(join(staticPath, redirectUrl));
      ctx.response.set("Content-Type", "text/html; charset=utf-8");
      ctx.body = src;
    };
  }

  apiHistoryFallback(options?: FallbackOptions) {
    app.use(this.apiHistoryFallbackMiddleware(options));
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
  bodyParser(bodyParserOptions: BodyParserOptions) {
    // set body parser options
    app.use(koaBody(bodyParserOptions));

  }
  close() {
    this.server.close();
  }
}
namespace KoaMicro {
  export class KoaMicro { }
}

const app = new KoaMicro();

export {
  app, Application, HttpStatusCode,
  KoaErrors, KoaMicro, LogLevels,
  validators
};

