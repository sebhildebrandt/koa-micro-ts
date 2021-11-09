"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (options = {}) => {
    const defaultOptions = {
        allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        credentials: true,
        maxAge: 3600
    };
    for (const key in defaultOptions) {
        if (!Object.prototype.hasOwnProperty.call(options, key)) {
            options[key] = defaultOptions[key];
        }
    }
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        let origin;
        if (typeof options.origin === 'function') {
            origin = options.origin(ctx);
        }
        else {
            origin = options.origin || ctx.get('Access-Control-Allow-Origin') || '*';
        }
        if (!origin) {
            return yield next();
        }
        ctx.set('Access-Control-Allow-Methods', options.allowMethods.join(','));
        ctx.set('Access-Control-Allow-Origin', origin);
        if (options.maxAge) {
            ctx.set('Access-Control-Max-Age', String(options.maxAge));
        }
        if (options.credentials === true) {
            ctx.set('Access-Control-Allow-Credentials', 'true');
        }
        if (options.allowHeaders) {
            ctx.set('Access-Control-Allow-Headers', options.allowHeaders.join(','));
        }
        else if (ctx.get('Access-Control-Request-Headers')) {
            ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
        }
        if (options.exposeHeaders) {
            ctx.set('Access-Control-Expose-Headers', options.exposeHeaders.join(','));
        }
        if (ctx.method === 'OPTIONS') {
            ctx.status = 204;
        }
        else {
            yield next();
        }
    });
};
//# sourceMappingURL=cors.js.map