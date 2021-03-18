'use strict';

exports.index = async (ctx: any, next: any) => {
  ctx.body = {
    app: 'koa-micro-ts',
    path: 'Index API'
  }
};
