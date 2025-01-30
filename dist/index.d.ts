/// <reference types="koa__router" />
import Router from '@koa/router';
import Application from 'koa';
import { BodyParserOptions, FallbackOptions, KoaErrors, StaticServeOptions } from './app.interface';
import { HttpStatusCode } from './httpStatus';
import { iLogOptions, Logger, LogLevels } from './log';
import validators from './validators';
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
    static: (filePath: string, opts?: StaticServeOptions) => void;
    apiDoc: string;
    apiDocObj: any;
    health: (options?: HealthOptions) => void;
    stats: (statsPath?: string) => void;
    newRouter: (prefix?: string) => Router<Application.DefaultState, Application.DefaultContext>;
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
    autoRoute: (routepath: string, mountpoint?: string, auth?: boolean) => Promise<void>;
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
export { app, Application, HttpStatusCode, KoaErrors, KoaMicro, LogLevels, validators };
