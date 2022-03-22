"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoRoute = void 0;
const path_1 = require("path");
const router_1 = __importDefault(require("@koa/router"));
const jwt_1 = __importDefault(require("./jwt"));
const log_1 = require("./log");
const apiDoc_1 = require("./apiDoc");
const fs_1 = require("fs");
const routerSuffixJs = '.route.js';
const routerSuffixTs = '.route.ts';
const readdirSyncRecursive = (filePath, allFiles) => {
    try {
        const stats = (0, fs_1.statSync)(filePath);
        if (stats.isFile()) {
            allFiles.push(filePath);
        }
        else if (stats.isDirectory()) {
            (0, fs_1.readdirSync)(filePath).forEach((fileName) => {
                if ('.' !== fileName.substring(0, 1)) {
                    readdirSyncRecursive((0, path_1.join)(filePath, fileName), allFiles);
                }
            });
        }
    }
    catch (e) { }
};
const autoRoute = (app, routepath, mountpoint, auth) => {
    mountpoint = mountpoint || '';
    auth = auth || false;
    const routes = new router_1.default({
        prefix: mountpoint
    });
    const files = [];
    let docObj = app.apiDocObj;
    if (app && app.log && app.log.level && app.log.level === log_1.LogLevels.all) {
        app.log.note('\n   Auto-Install Routes: (' + (auth ? 'private/auth' : 'public') + ')\n   Path: ' + routepath + '\n', false, false);
    }
    readdirSyncRecursive(routepath, files);
    for (const file of files) {
        const root = routepath;
        if (file.endsWith(routerSuffixJs) || file.endsWith(routerSuffixTs)) {
            const relfile = file.substring(root.length, 1000);
            const fileName = (0, path_1.join)(root, relfile);
            if (app.apiDoc) {
                const doc = (0, apiDoc_1.parseFileApiDoc)(fileName, auth) || {};
                docObj = (0, apiDoc_1.mergeDeep)(docObj, doc);
            }
            const obj = require(fileName);
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
                            url = (0, path_1.join)(url, '/get');
                            break;
                        case 'detail':
                            method = 'get';
                            url = (0, path_1.join)(url, '/:id');
                            break;
                        case 'detail_detail':
                            method = 'get';
                            url = (0, path_1.join)(url, '/:id/:id2');
                            break;
                        case 'detail_detail_detail':
                            method = 'get';
                            url = (0, path_1.join)(url, '/:id/:id2/:id3');
                            break;
                        case 'index':
                            method = 'get';
                            break;
                        case 'star':
                            method = 'get';
                            url = (0, path_1.join)(url, '/*');
                            break;
                        case 'set':
                            method = 'get';
                            url = (0, path_1.join)(url, '/set');
                            break;
                        case 'post':
                            method = 'post';
                            break;
                        case 'post_detail':
                            method = 'post';
                            url = (0, path_1.join)(url, '/:id');
                            break;
                        case 'post_detail_detail':
                            method = 'post';
                            url = (0, path_1.join)(url, '/:id/:id2');
                            break;
                        case 'post_detail_detail_detail':
                            method = 'post';
                            url = (0, path_1.join)(url, '/:id/:id2/:id3');
                            break;
                        case 'put':
                            method = 'put';
                            break;
                        case 'put_detail':
                            method = 'put';
                            url = (0, path_1.join)(url, '/:id');
                            break;
                        case 'put_detail_detail':
                            method = 'put';
                            url = (0, path_1.join)(url, '/:id/:id2');
                            break;
                        case 'put_detail_detail_detail':
                            method = 'put';
                            url = (0, path_1.join)(url, '/:id/:id2/:id3');
                            break;
                        case 'delete_detail':
                            method = 'delete';
                            url = (0, path_1.join)(url, '/:id');
                            break;
                        case 'delete_detail_detail':
                            method = 'delete';
                            url = (0, path_1.join)(url, '/:id/:id2');
                            break;
                        case 'delete_detail_detail_detail':
                            method = 'delete';
                            url = (0, path_1.join)(url, '/:id/:id2/:id3');
                            break;
                        default:
                            throw new Error('unrecognized route: ' + relfile + '.' + key);
                    }
                    if (method) {
                        url = url.replace(/\\/g, "/");
                        ;
                        if (auth) {
                            routes[method](url, jwt_1.default.middleware(), obj[key]);
                        }
                        else {
                            routes[method](url, obj[key]);
                        }
                        if (app && app.log && app.log.level && app.log.level === log_1.LogLevels.all) {
                            app.log.note('       ' + mountpoint + url + '   ---   ' + method + ' - Function: ' + key, false, false);
                        }
                    }
                }
            }
        }
    }
    app.use(routes.routes()).use(routes.allowedMethods());
    if (app && app.log && app.log.level && app.log.level === log_1.LogLevels.all) {
        app.log.note('', false, false);
    }
    if (app.apiDoc) {
        app.apiDocObj = docObj;
    }
};
exports.autoRoute = autoRoute;
//# sourceMappingURL=autoRoute.js.map