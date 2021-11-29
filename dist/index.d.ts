/// <reference types="koa__router" />
import Router from '@koa/router';
import { HttpStatusCode } from './httpStatus';
import { KoaErrors, BodyParserOptions, FallbackOptions, StaticServeOptions } from './app.interface';
import { Logger, LogLevels, iLogOptions } from './log';
import validators from './validators';
import Application from 'koa';
interface HealthOptions {
    livePath?: string;
    readyPath?: string;
    isReady?: any;
    name?: string;
    version?: string;
}
declare class KoaMicro extends Application {
    private server;
    private staticPath;
    constructor();
    ready: boolean;
    helmet: () => void;
    gracefulShutdown: (options?: {}) => void;
    static: (filePath: string, opts?: StaticServeOptions | undefined) => void;
    apiDoc: string;
    apiDocObj: any;
    health: (options?: HealthOptions | undefined) => void;
    newRouter: (prefix?: string | undefined) => Router<Application.DefaultState, Application.DefaultContext>;
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
    private apiHistoryFallbackMiddleware;
    apiHistoryFallback(options?: FallbackOptions): void;
    catchErrors(): void;
    parseArgs(alias?: any): void;
    bodyParser(bodyParserOptions: BodyParserOptions): void;
    close(): void;
}
declare namespace KoaMicro {
    class KoaMicro {
    }
}
declare const app: KoaMicro;
export { app, LogLevels, validators, Application, KoaMicro, HttpStatusCode, KoaErrors };
