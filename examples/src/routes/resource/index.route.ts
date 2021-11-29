'use strict';

/**
 * @api {get} /api/v1/resource/?params Display all query params
 * @apiName Get with Query
 * @apiGroup Example API
 *
 * @apiParam {string} firstname Firstname as query parameter (example)
 * @apiParam {string} lastname Lastname as query parameter (example)
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 */

exports.index = async (ctx: any, next: any) => {
  ctx.body = ctx.query;
};
