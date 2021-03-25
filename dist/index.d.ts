/// <reference types="koa__router" />
import Router from '@koa/router';
import { logLevel, logOptions } from './log';
import * as validators from './validators';
import Application from 'koa';
declare class KoaMicro extends Application {
    constructor();
    helmet: () => void;
    gracefulShutdown: (options?: {}) => void;
    static: (path: string) => void;
    health: (path?: string | undefined, option?: any) => void;
    newRouter: (prefix?: string | undefined) => Router<any, {}>;
    useRouter: (router: Router) => void;
    cors: (options?: any) => void;
    jwt: (options?: any) => {
        middleware: () => (ctx: any, next: any) => Promise<void>;
        init: (options: any) => void;
        sign: (claims: any, expiresIn: any) => string;
        check: (ctx: any) => Promise<any>;
        verify: typeof import("jsonwebtoken").verify;
        decode: typeof import("jsonwebtoken").decode;
        catchErrors: (message?: any) => (ctx: any, next: any) => Promise<void>;
    };
    start: (port: number) => void;
    autoRoute: (routepath: string, mountpoint?: string | undefined, auth?: boolean | undefined) => void;
    logger(options: logOptions): {
        clear: (num: number) => void;
        error: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
        info: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
        light: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
        log: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
        note: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
        trace: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
        warn: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    };
    args: any;
    getArgs(alias: any): void;
}
declare const app: KoaMicro;
export { app, logLevel, validators, Application };
