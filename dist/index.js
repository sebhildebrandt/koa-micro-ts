'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusCode = exports.KoaMicro = exports.Application = exports.validators = exports.LogLevels = exports.app = void 0;
const koa_body_1 = __importDefault(require("koa-body"));
const http_graceful_shutdown_1 = __importDefault(require("http-graceful-shutdown"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const router_1 = __importDefault(require("@koa/router"));
const serve = require("koa-static");
const httpStatus_1 = require("./httpStatus");
Object.defineProperty(exports, "HttpStatusCode", { enumerable: true, get: function () { return httpStatus_1.HttpStatusCode; } });
const cors_1 = __importDefault(require("./cors"));
const log_1 = require("./log");
Object.defineProperty(exports, "LogLevels", { enumerable: true, get: function () { return log_1.LogLevels; } });
const args_1 = __importDefault(require("./args"));
const jwt_1 = __importDefault(require("./jwt"));
const autoRoute_1 = require("./autoRoute");
const validators = __importStar(require("./validators"));
exports.validators = validators;
const koa_1 = __importDefault(require("koa"));
exports.Application = koa_1.default;
const apiDoc_1 = require("./apiDoc");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
;
class KoaMicro extends koa_1.default {
    constructor() {
        super();
        this.ready = false;
        this.helmet = () => {
            this.use(koa_helmet_1.default());
        };
        this.gracefulShutdown = (options = {}) => {
            http_graceful_shutdown_1.default(app, options);
        };
        this.static = (filepath) => {
            this.staticPath = filepath;
            this.use(serve(filepath));
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
                if (options && options.name) {
                    status.name = options.name;
                }
                if (process.env.APP_VERSION) {
                    status.version = process.env.APP_VERSION;
                }
                if (options && options.version) {
                    status.version = options.version;
                }
                status.check = 'liveness';
                status.status = 'up';
                status.resultcode = 200;
                ctx.body = status;
            });
            router.get(options.readyPath, (ctx) => __awaiter(this, void 0, void 0, function* () {
                const status = {};
                if (process.env.APP_NAME) {
                    status.name = process.env.APP_NAME;
                }
                if (options && options.name) {
                    status.name = options.name;
                }
                if (process.env.APP_VERSION) {
                    status.version = process.env.APP_VERSION;
                }
                if (options && options.version) {
                    status.version = options.version;
                }
                status.check = 'readyness';
                status.status = 'not ready';
                ctx.status = 503;
                if (options && options.isReady) {
                    let res = false;
                    try {
                        res = yield options.isReady();
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
            }));
            this
                .use(router.routes())
                .use(router.allowedMethods());
            if (this.apiDoc) {
                const healthDoc = apiDoc_1.healthDocObj(options.readyPath, options.livePath);
                this.apiDocObj = apiDoc_1.mergeDeep(this.apiDocObj, healthDoc);
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
            this.use(cors_1.default(options));
        };
        this.jwt = (options = {}) => {
            jwt_1.default.init(options);
            return jwt_1.default;
        };
        this.start = (port) => {
            if (this.apiDoc) {
                const router = new router_1.default();
                router.get(this.apiDoc, (ctx) => __awaiter(this, void 0, void 0, function* () {
                    ctx.status = 200;
                    ctx.body = apiDoc_1.createHtml(this.apiDocObj);
                }));
                this
                    .use(router.routes())
                    .use(router.allowedMethods());
            }
            this.server = this.listen(port || 3000);
        };
        this.log = new log_1.Logger({
            level: log_1.LogLevels.none
        });
        this.autoRoute = (routepath, mountpoint, auth) => {
            mountpoint = mountpoint || '';
            auth = auth || false;
            autoRoute_1.autoRoute(this, routepath, mountpoint, auth);
        };
        this.args = {};
        this.catchErrorsFn = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield next();
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
        });
        this.development = (process.env && process.env.DEVELOPMENT) ? true : false;
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
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const start = ctx[Symbol.for('request-received.startTime')]
                ? ctx[Symbol.for('request-received.startTime')].getTime()
                : Date.now();
            try {
                this.log.info(`  <-- ${ctx.method} ${ctx.originalUrl}`);
                yield next();
                if (ctx.status < 400) {
                    this.log.info(`  --> ${ctx.method} ${ctx.originalUrl} ${ctx.status || 500} ${time(start)} ${len(ctx)}`);
                }
                else {
                    this.log.error(`  --> ${ctx.method} ${ctx.originalUrl} ${ctx.status || 500} ${time(start)} ${len(ctx)}`);
                }
            }
            catch (err) {
                this.log.error(`  xxx ${ctx.method} ${ctx.originalUrl} ${err.status || 500} ${time(start)}`);
                throw err;
            }
        });
    }
    apiHistoryFallbackMiddleware(options) {
        const staticPath = this.staticPath;
        return function (ctx, next) {
            if (ctx.method !== 'GET') {
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
            if (options && options.ignore && typeof options.ignore === 'string') {
                ignore = [options.ignore];
            }
            else {
                ignore = options ? options.ignore : null;
            }
            if (ignore && ignore.length) {
                let found = false;
                ignore.forEach((item) => {
                    if (parsedUrl.indexOf(item) !== -1) {
                        console.log(item, parsedUrl);
                        found = true;
                    }
                });
                if (found) {
                    return next();
                }
            }
            const redirectUrl = options && options.index ? options.index : '/index.html';
            ctx.url = redirectUrl;
            const src = fs.createReadStream(path.join(staticPath, redirectUrl));
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
        this.args = args_1.default(alias);
        if (this.args.development || this.args.dev) {
            this.development = true;
        }
    }
    bodyParser(bodyParserOptions) {
        app.use(koa_body_1.default(bodyParserOptions));
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
})(KoaMicro || (KoaMicro = {}));
exports.KoaMicro = KoaMicro;
const app = new KoaMicro();
exports.app = app;
//# sourceMappingURL=index.js.map