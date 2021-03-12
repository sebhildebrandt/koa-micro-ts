'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.app = void 0;
/**
 * ====================================================================
 * @koa/micro - microservice template
 * ====================================================================
 * application.js
 * --------------------------------------------------------------------
 * Version 1.0
 * ====================================================================
 */
const koa_1 = __importDefault(require("koa"));
const app = new koa_1.default();
exports.app = app;
const config = {
    hello: 'world'
};
exports.config = config;
//# sourceMappingURL=application.js.map