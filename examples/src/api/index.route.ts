'use strict';

exports.index = async (ctx: any, next: any) => {
  ctx.body = {
    app: '@koa/micro',
    path: 'Index API'
  }
};
