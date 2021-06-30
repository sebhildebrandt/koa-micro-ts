'use strict';

/**
 * @api {get} /api/v1/hello Hello koa-micto-ts
 * @apiName Get
 * @apiGroup Example API
 *
 * @apiSuccess {String} message hello message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Hello koa-micro-ts API",
 *     }
 */

exports.index = async (ctx: any, next: any) => {
  ctx.body = {
    message: 'Hello koa-micro-ts API'
  }
};
