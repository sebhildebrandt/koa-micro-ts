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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.validators = exports.app = void 0;
const koa_body_1 = __importDefault(require("koa-body"));
const http_graceful_shutdown_1 = __importDefault(require("http-graceful-shutdown"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const router_1 = __importDefault(require("@koa/router"));
const serve = require("koa-static");
const cors_1 = __importDefault(require("./cors"));
const jwt_1 = __importDefault(require("./jwt"));
const autoRoute_1 = require("./autoRoute");
const validators = __importStar(require("./validators"));
exports.validators = validators;
const koa_1 = __importDefault(require("koa"));
exports.Application = koa_1.default;
class KoaMicro extends koa_1.default {
    constructor() {
        super();
        this.helmet = () => {
            this.use(koa_helmet_1.default());
        };
        this.gracefulShutdown = (options = {}) => {
            http_graceful_shutdown_1.default(app, options);
        };
        this.static = (path) => {
            this.use(serve(path));
        };
        this.health = (path, option) => {
            path = path || '/health';
            const router = new router_1.default({
                prefix: path
            });
            router.get('/', (ctx) => {
                const status = {};
                if (process.env.APP_NAME) {
                    status.name = process.env.APP_NAME;
                }
                if (option && option.name) {
                    status.name = option.name;
                }
                if (process.env.APP_VERSION) {
                    status.version = process.env.APP_VERSION;
                }
                if (option && option.version) {
                    status.version = option.version;
                }
                status.status = 'ok';
                ctx.body = status;
            });
            this
                .use(router.routes())
                .use(router.allowedMethods());
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
            this.listen(port);
        };
        this.autoRoute = (routepath, mountpoint, auth) => {
            mountpoint = mountpoint || '';
            auth = auth || false;
            autoRoute_1.autoRoute(this, routepath, mountpoint, auth);
        };
    }
}
const app = new KoaMicro();
exports.app = app;
app.use(koa_body_1.default());
//# sourceMappingURL=index.js.map