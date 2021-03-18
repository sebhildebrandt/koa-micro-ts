'use strict';

exports.index = async (ctx: any, next: any) => {
  ctx.body = {
    message: 'Hello koa-micro-ts API'
  }
};
