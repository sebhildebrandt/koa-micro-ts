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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../dist/index");
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
exports.index = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    index_1.app.log.trace('API INDEX Route invoked');
    ctx.body = {
        app: 'koa-micro-ts',
        path: 'Index API'
    };
});
//# sourceMappingURL=index.route.js.map