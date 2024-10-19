"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.autoRoute = void 0;
const router_1 = __importDefault(require("@koa/router"));
const fs_1 = require("fs");
const path_1 = require("path");
const apiDoc_1 = require("./apiDoc");
const jwt_1 = __importDefault(require("./jwt"));
const log_1 = require("./log");
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
const autoRoute = (app, routepath, mountpoint, auth) => __awaiter(void 0, void 0, void 0, function* () {
    mountpoint = mountpoint !== null && mountpoint !== void 0 ? mountpoint : '';
    auth = auth !== null && auth !== void 0 ? auth : false;
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
            const obj = yield Promise.resolve().then(() => __importStar(require(fileName)));
            let method;
            let url;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
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
                            method = '';
                            url = '';
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
});
exports.autoRoute = autoRoute;
//# sourceMappingURL=autoRoute.js.map