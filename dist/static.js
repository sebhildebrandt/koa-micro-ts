"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const path_1 = require("path");
const send = require("koa-send");
function serve(root, opts) {
    var _a;
    opts = opts !== null && opts !== void 0 ? opts : {};
    if (opts.index !== false)
        opts.index = (_a = opts.index) !== null && _a !== void 0 ? _a : 'index.html';
    opts.root = (0, path_1.resolve)(root);
    return async function serve(ctx, next) {
        let servePath = ctx.path;
        let mountPoint = '';
        if (opts === null || opts === void 0 ? void 0 : opts.mountPoint) {
            mountPoint = opts.mountPoint;
            if (!mountPoint.startsWith('/')) {
                mountPoint = '/' + mountPoint;
            }
            if (mountPoint.endsWith('/')) {
                mountPoint = mountPoint.slice(0, -1);
            }
        }
        let done = false;
        if ((ctx.method === 'HEAD' || ctx.method === 'GET') && (!mountPoint || ctx.path.startsWith(mountPoint + '/') || ctx.path === mountPoint)) {
            servePath = servePath.substring(mountPoint.length) || '/';
            try {
                done = !!(await send(ctx, servePath, opts));
            }
            catch (err) {
                if (err.status !== 404) {
                    throw err;
                }
            }
        }
        if (!done) {
            await next();
        }
    };
}
exports.serve = serve;
//# sourceMappingURL=static.js.map