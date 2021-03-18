'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const koa_body_1 = __importDefault(require("koa-body"));
const http_graceful_shutdown_1 = __importDefault(require("http-graceful-shutdown"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const router_1 = __importDefault(require("@koa/router"));
const serve = require("koa-static");
const cors_1 = __importDefault(require("./cors"));
const jwt_1 = __importDefault(require("./jwt"));
const autoRoute_1 = require("./autoRoute");
const Application = require("koa");
class KoaMicro extends Application {
    constructor() {
        super();
        this.helmet = () => {
            this.use(koa_helmet_1.default());
        };
        this.gracefulShutdown = (options = {}) => {
            http_graceful_shutdown_1.default(app, options);
        };
        this.static = (path, mountpoint) => {
            mountpoint = mountpoint || '';
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
                if (option.name) {
                    status.name = option.name;
                }
                if (process.env.APP_VERSION) {
                    status.version = process.env.APP_VERSION;
                }
                if (option.version) {
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
//# sourceMappingURL=application.js.map