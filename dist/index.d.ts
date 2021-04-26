/// <reference types="koa__router" />
import Router from '@koa/router';
import { HttpStatusCode } from './httpStatus';
import { KoaErrors } from './error.interface';
import { Logger, LogLevels, iLogOptions } from './log';
import * as validators from './validators';
import Application from 'koa';
declare class KoaMicro extends Application {
    private server;
    constructor();
    helmet: () => void;
    gracefulShutdown: (options?: {}) => void;
    static: (filepath: string) => void;
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
    log: Logger;
    autoRoute: (routepath: string, mountpoint?: string | undefined, auth?: boolean | undefined) => void;
    logger(options: iLogOptions): Logger;
    args: any;
    development: boolean;
    private catchErrorsFn;
    private logMiddleware;
    catchErrors(): void;
    parseArgs(alias?: any): void;
    close(): void;
}
declare namespace KoaMicro {
    class KoaMicro {
    }
}
declare const app: KoaMicro;
export { app, LogLevels, validators, Application, KoaMicro, HttpStatusCode, KoaErrors };
