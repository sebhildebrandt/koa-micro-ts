'use strict';

import { app } from '../../../dist/index'

exports.index = async (ctx: any, next: any) => {
  app.log.trace('API INDEX Route invoked');
  ctx.body = {
    app: 'koa-micro-ts',
    path: 'Index API'
  }
};
