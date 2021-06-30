'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.index = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = ctx.query;
});
//# sourceMappingURL=index.route.js.map