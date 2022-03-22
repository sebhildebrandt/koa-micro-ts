'use strict';

import { KoaErrors } from '../../../dist/index';

exports.index = async (ctx: any, next: any) => {
  const err: KoaErrors = new Error('FORCED ERROR');
  err.code = 'CODE_0001';
  err.description = 'Error Description';

  throw err;
  ctx.body = {
    message: 'Forced error koa-micro-ts API'
  };
};
