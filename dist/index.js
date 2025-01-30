"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = exports.LogLevels = exports.KoaMicro = exports.HttpStatusCode = exports.Application = exports.app = void 0;
const router_1 = __importDefault(require("@koa/router"));
const fs_1 = require("fs");
const http_graceful_shutdown_1 = __importDefault(require("http-graceful-shutdown"));
const koa_1 = __importDefault(require("koa"));
exports.Application = koa_1.default;
const koa_body_1 = __importDefault(require("koa-body"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const path_1 = require("path");
const apiDoc_1 = require("./apiDoc");
const args_1 = __importDefault(require("./args"));
const autoRoute_1 = require("./autoRoute");
const cors_1 = __importDefault(require("./cors"));
const requestStats_1 = require("./requestStats");
const httpStatus_1 = require("./httpStatus");
Object.defineProperty(exports, "HttpStatusCode", { enumerable: true, get: function () { return httpStatus_1.HttpStatusCode; } });
const jwt_1 = __importDefault(require("./jwt"));
const log_1 = require("./log");
Object.defineProperty(exports, "LogLevels", { enumerable: true, get: function () { return log_1.LogLevels; } });
const static_1 = require("./static");
const validators_1 = __importDefault(require("./validators"));
exports.validators = validators_1.default;
;
class KoaMicro extends koa_1.default {
    constructor() {
        var _a;
        super();
        this.ready = false;
        this.helmet = () => {
            this.use((0, koa_helmet_1.default)());
        };
        this.gracefulShutdown = (options = {}) => {
            (0, http_graceful_shutdown_1.default)(app, options);
        };
        this.static = (filePath, opts) => {
            this.staticPath = filePath;
            this.use((0, static_1.serve)(filePath, opts));
        };
        this.apiDoc = '';
        this.apiDocObj = {};
        this.health = (options) => {
            const router = new router_1.default();
            if (!options) {
                options = {};
            }
            if (!options.livePath) {
                options.livePath = '/live';
            }
            if (!options.readyPath) {
                options.readyPath = '/ready';
            }
            router.get(options.livePath, (ctx) => {
                const status = {};
                if (process.env.APP_NAME) {
                    status.name = process.env.APP_NAME;
                }
                if (options === null || options === void 0 ? void 0 : options.name) {
                    status.name = options.name;
                }
                if (process.env.APP_VERSION) {
                    status.version = process.env.APP_VERSION;
                }
                if (options === null || options === void 0 ? void 0 : options.version) {
                    status.version = options.version;
                }
                status.check = 'liveness';
                status.status = 'up';
                status.resultcode = 200;
                ctx.body = status;
            });
            router.get(options.readyPath, async (ctx) => {
                const status = {};
                if (process.env.APP_NAME) {
                    status.name = process.env.APP_NAME;
                }
                if (options === null || options === void 0 ? void 0 : options.name) {
                    status.name = options.name;
                }
                if (process.env.APP_VERSION) {
                    status.version = process.env.APP_VERSION;
                }
                if (options === null || options === void 0 ? void 0 : options.version) {
                    status.version = options.version;
                }
                status.check = 'readyness';
                status.status = 'not ready';
                ctx.status = 503;
                if (options === null || options === void 0 ? void 0 : options.isReady) {
                    let res = false;
                    try {
                        res = await options.isReady();
                    }
                    catch (e) {
                        res = false;
                    }
                    if (res) {
                        status.status = 'ready';
                        ctx.status = 200;
                    }
                }
                else if (this.ready) {
                    status.status = 'ready';
                    ctx.status = 200;
                }
                status.resultcode = ctx.status;
                ctx.body = status;
            });
            this
                .use(router.routes())
                .use(router.allowedMethods());
            if (this.apiDoc) {
                const healthDoc = (0, apiDoc_1.healthDocObj)(options.readyPath, options.livePath);
                this.apiDocObj = (0, apiDoc_1.mergeDeep)(this.apiDocObj, healthDoc);
            }
        };
        this.stats = (statsPath = '/stats') => {
            this.use(requestStats_1.requestStatsMiddleware);
            const router = new router_1.default();
            router.get(statsPath, (ctx) => {
                ctx.body = {
                    message: "Request statistics",
                    stats: requestStats_1.requestStats
                };
                ctx.status = 200;
            });
            this.use(router.routes());
            if (this.apiDoc) {
                const statsDoc = (0, apiDoc_1.statsDocObj)(statsPath);
                this.apiDocObj = (0, apiDoc_1.mergeDeep)(this.apiDocObj, statsDoc);
            }
        };
        this.newRouter = (prefix) => {
            return new router_1.default({
                prefix
            });
        };
        this.useRouter = (router) => {
            this
                .use(router.routes())
                .use(router.allowedMethods());
        };
        this.cors = (options = {}) => {
            this.use((0, cors_1.default)(options));
        };
        this.jwt = (options = {}) => {
            jwt_1.default.init(options);
            return jwt_1.default;
        };
        this.start = (port) => {
            if (this.apiDoc) {
                const router = new router_1.default();
                router.get(this.apiDoc, async (ctx) => {
                    ctx.status = 200;
                    ctx.body = (0, apiDoc_1.createHtml)(this.apiDocObj);
                });
                this
                    .use(router.routes())
                    .use(router.allowedMethods());
            }
            this.server = this.listen(port || 3000);
        };
        this.log = new log_1.Logger({
            level: log_1.LogLevels.none
        });
        this.autoRoute = async (routepath, mountpoint, auth) => {
            mountpoint = mountpoint !== null && mountpoint !== void 0 ? mountpoint : '';
            auth = auth !== null && auth !== void 0 ? auth : false;
            await (0, autoRoute_1.autoRoute)(this, routepath, mountpoint, auth);
        };
        this.args = {};
        this.catchErrorsFn = async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                if (err === null) {
                    err = {};
                }
                const status = err.status || 500;
                const code = err.code || -1;
                const message = err.message || 'Error';
                const description = err.description || '';
                this.log.error(`Status: ${status}, Code: ${code}, Message: ${message}, Description: ${description}`);
                ctx.status = status;
                ctx.type = 'application/json';
                ctx.body = JSON.stringify({
                    status,
                    code,
                    message,
                    description
                });
            }
        };
        this.development = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.DEVELOPMENT) ? true : false;
        this.staticPath = '';
    }
    logger(options) {
        this.log = new log_1.Logger(options);
        if (this.log.logLevel() >= log_1.LogLevels.info) {
            app.use(this.logMiddleware());
        }
        return this.log;
    }
    logMiddleware() {
        function time(start) {
            const delta = Date.now() - start;
            return delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's';
        }
        function len(ctx) {
            let result = '';
            if (![204, 205, 304].includes(ctx.status) && ctx.length) {
                result += ctx.length + ' Bytes';
            }
            return result;
        }
        return async (ctx, next) => {
            const start = ctx[Symbol.for('request-received.startTime')]
                ? ctx[Symbol.for('request-received.startTime')].getTime()
                : Date.now();
            try {
                this.log.http(`  <-- ${ctx.method} ${ctx.originalUrl}`);
                await next();
                if (ctx.status < 400) {
                    this.log.http(`  --> ${ctx.method} ${ctx.originalUrl} ${ctx.status || 500} ${time(start)} ${len(ctx)}`);
                }
                else {
                    this.log.error(`  --> ${ctx.method} ${ctx.originalUrl} ${ctx.status || 500} ${time(start)} ${len(ctx)}`);
                }
            }
            catch (err) {
                this.log.error(`  xxx ${ctx.method} ${ctx.originalUrl} ${err.status || 500} ${time(start)}`);
                throw err;
            }
        };
    }
    apiHistoryFallbackMiddleware(options) {
        const staticPath = this.staticPath;
        return function (ctx, next) {
            if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
                return next();
            }
            if (!ctx.headers || typeof ctx.headers.accept !== 'string') {
                return next();
            }
            const parsedUrl = ctx.url;
            if (ctx.headers.accept.indexOf('application/json') >= 0) {
                return next();
            }
            if (ctx.headers.accept.indexOf('text/html') === -1 || ctx.headers.accept.indexOf('*/*') === -1) {
                return next();
            }
            if (parsedUrl.indexOf('.') !== -1) {
                return next();
            }
            let ignore;
            if ((options === null || options === void 0 ? void 0 : options.ignore) && typeof options.ignore === 'string') {
                ignore = [options.ignore];
            }
            else {
                ignore = options ? options.ignore : null;
            }
            if (ignore === null || ignore === void 0 ? void 0 : ignore.length) {
                let found = false;
                ignore.forEach((item) => {
                    if (parsedUrl.indexOf(item) !== -1) {
                        found = true;
                    }
                });
                if (found) {
                    return next();
                }
            }
            const redirectUrl = (options === null || options === void 0 ? void 0 : options.index) ? options.index : '/index.html';
            ctx.url = redirectUrl;
            const src = (0, fs_1.createReadStream)((0, path_1.join)(staticPath, redirectUrl));
            ctx.response.set("Content-Type", "text/html; charset=utf-8");
            ctx.body = src;
        };
    }
    apiHistoryFallback(options) {
        app.use(this.apiHistoryFallbackMiddleware(options));
    }
    catchErrors() {
        this.use(this.catchErrorsFn);
    }
    parseArgs(alias) {
        this.args = (0, args_1.default)(alias);
        if (this.args.development || this.args.dev) {
            this.development = true;
        }
    }
    bodyParser(bodyParserOptions) {
        app.use((0, koa_body_1.default)(bodyParserOptions));
    }
    close() {
        this.server.close();
    }
}
exports.KoaMicro = KoaMicro;
(function (KoaMicro_1) {
    class KoaMicro {
    }
    KoaMicro_1.KoaMicro = KoaMicro;
})(KoaMicro || (exports.KoaMicro = KoaMicro = {}));
const app = new KoaMicro();
exports.app = app;
//# sourceMappingURL=index.js.map