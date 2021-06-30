'use strict';

import { app } from '../../../dist/index'

/**
 * @api {get} /api/v1/ Index Route
 * @apiName Get
 * @apiGroup Example API
 *
 * @apiSuccess {string} app 'koa-micro-ts'.
 * @apiSuccess {string} path 'Index API'.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "app": "koa-micro-ts",
 *       "path": "Index API"
 *     }
 */

exports.index = async (ctx: any, next: any) => {
  app.log.trace('API INDEX Route invoked');
  ctx.body = {
    app: 'koa-micro-ts',
    path: 'Index API'
  }
};
