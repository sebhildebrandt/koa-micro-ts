'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoRoute = void 0;
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("@koa/router"));
const jwt_1 = __importDefault(require("./jwt"));
const fs_1 = __importDefault(require("fs"));
const routerSuffixJs = '.route.js';
const routerSuffixTs = '.route.ts';
function readdirSyncRecursive(filePath, allFiles) {
    try {
        const stats = fs_1.default.statSync(filePath);
        if (stats.isFile()) {
            allFiles.push(filePath);
        }
        else if (stats.isDirectory()) {
            fs_1.default.readdirSync(filePath).forEach((fileName) => {
                if ('.' !== fileName.substring(0, 1)) {
                    readdirSyncRecursive(path_1.default.join(filePath, fileName), allFiles);
                }
            });
        }
    }
    catch (e) { }
}
function autoRoute(app, routepath, mountpoint, auth) {
    mountpoint = mountpoint || '';
    auth = auth || false;
    const routes = new router_1.default({
        prefix: mountpoint
    });
    const files = [];
    readdirSyncRecursive(routepath, files);
    for (const file of files) {
        const root = routepath;
        if (file.endsWith(routerSuffixJs) || file.endsWith(routerSuffixTs)) {
            const relfile = file.substring(root.length, 1000);
            const obj = require(path_1.default.join(root, relfile));
            let method;
            let url;
            let admin;
            let all;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    admin = false;
                    all = false;
                    method = '';
                    url = relfile;
                    if (url.endsWith(routerSuffixJs)) {
                        url = url.substring(url.length - routerSuffixJs.length, 0);
                    }
                    if (url.endsWith(routerSuffixTs)) {
                        url = url.substring(url.length - routerSuffixTs.length, 0);
                    }
                    if ('index' === url.substr(url.length - 5)) {
                        url = url.substring(url.length - 5, 0);
                    }
                    switch (key) {
                        case 'list':
                            method = 'get';
                            break;
                        case 'get':
                            method = 'get';
                            url = path_1.default.join(url, '/get');
                            break;
                        case 'set':
                            method = 'get';
                            url = path_1.default.join(url, '/set');
                            break;
                        case 'detail':
                            method = 'get';
                            url = path_1.default.join(url, '/:id');
                            break;
                        case 'detail_detail':
                            method = 'get';
                            url = path_1.default.join(url, '/:id/:id2');
                            break;
                        case 'detail_detail_detail':
                            method = 'get';
                            url = path_1.default.join(url, '/:id/:id2/:id3');
                            break;
                        case 'index':
                            method = 'get';
                            break;
                        case 'star':
                            method = 'get';
                            url = path_1.default.join(url, '/*');
                            break;
                        case 'post':
                            method = 'post';
                            break;
                        case 'post_detail':
                            method = 'post';
                            url = path_1.default.join(url, '/:id');
                            break;
                        case 'delete_detail':
                            method = 'delete';
                            url = path_1.default.join(url, '/:id');
                            break;
                        case 'post_detail_detail':
                            method = 'post';
                            url = path_1.default.join(url, '/:id/:id2');
                            break;
                        default:
                            throw new Error('unrecognized route: ' + relfile + '.' + key);
                    }
                    if (method) {
                        if (auth) {
                            routes[method](url, jwt_1.default.middleware(), obj[key]);
                        }
                        else {
                            routes[method](url, obj[key]);
                        }
                    }
                }
            }
        }
    }
    app.use(routes.routes()).use(routes.allowedMethods());
}
exports.autoRoute = autoRoute;
;
//# sourceMappingURL=autoRoute.js.map