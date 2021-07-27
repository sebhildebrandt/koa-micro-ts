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
exports.serve = void 0;
const send = require("koa-send");
const path_1 = require("path");
function serve(root, opts) {
    opts = opts || {};
    if (opts.index !== false)
        opts.index = opts.index || 'index.html';
    opts.root = path_1.resolve(root);
    return function serve(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let servePath = ctx.path;
            let mountPoint = '';
            if (opts && opts.mountPoint) {
                mountPoint = opts.mountPoint;
                if (mountPoint[0] !== '/') {
                    mountPoint = '/' + mountPoint;
                }
                if (mountPoint.slice(-1) === '/') {
                    mountPoint = mountPoint.slice(0, -1);
                }
            }
            let done = false;
            if ((ctx.method === 'HEAD' || ctx.method === 'GET') && (!mountPoint || ctx.path.startsWith(mountPoint + '/') || ctx.path === mountPoint)) {
                console.log(servePath);
                console.log(mountPoint);
                servePath = servePath.substring(mountPoint.length) || '/';
                console.log(servePath);
                try {
                    done = !!(yield send(ctx, servePath, opts));
                }
                catch (err) {
                    if (err.status !== 404) {
                        throw err;
                    }
                }
            }
            if (!done) {
                yield next();
            }
        });
    };
}
exports.serve = serve;
//# sourceMappingURL=static.js.map