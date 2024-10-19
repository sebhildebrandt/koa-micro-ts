"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (options = {}) => {
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
    return async (ctx, next) => {
        let origin;
        if (typeof options.origin === 'function') {
            origin = options.origin(ctx);
        }
        else {
            origin = options.origin || ctx.get('Access-Control-Allow-Origin') || '*';
        }
        if (!origin) {
            return await next();
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
            await next();
        }
    };
};
//# sourceMappingURL=cors.js.map