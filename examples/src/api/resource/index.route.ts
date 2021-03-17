'use strict';

exports.index = async (ctx: any, next: any) => {
  ctx.body = ctx.query
};
