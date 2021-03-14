'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const http_graceful_shutdown_1 = __importDefault(require("http-graceful-shutdown"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const router_1 = __importDefault(require("@koa/router"));
const serve = require("koa-static");
const cors_1 = __importDefault(require("./cors"));
const jwt_1 = __importDefault(require("./jwt"));
const app = new koa_1.default();
exports.app = app;
app.use(koa_body_1.default());
app.helmet = () => {
    app.use(koa_helmet_1.default());
};
app.gracefulShutdown = (options = {}) => {
    http_graceful_shutdown_1.default(app, options);
};
app.static = (path) => {
    app.use(serve(path));
};
app.health = (path) => {
    const router = new router_1.default({
        prefix: path
    });
    router.get('/', (ctx) => {
        ctx.body = 'OK';
    });
    app
        .use(router.routes())
        .use(router.allowedMethods());
};
app.newRouter = (prefix) => {
    return new router_1.default({
        prefix
    });
};
app.useRouter = (router) => {
    app
        .use(router.routes())
        .use(router.allowedMethods());
};
app.cors = (options = {}) => {
    app.use(cors_1.default(options));
};
app.jwt = (options = {}) => {
    jwt_1.default.init(options);
    return jwt_1.default;
};
app.start = (port) => {
    app.listen(port);
};
//# sourceMappingURL=application.js.map