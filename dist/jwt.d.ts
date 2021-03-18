import _jwt from 'jsonwebtoken';
declare function init(options: any): void;
declare function middleware(): (ctx: any, next: any) => Promise<void>;
declare function sign(claims: any, expiresIn: any): string;
declare function check(ctx: any): Promise<any>;
declare function catchErrors(message?: any): (ctx: any, next: any) => Promise<void>;
declare const _default: {
    middleware: typeof middleware;
    init: typeof init;
    sign: typeof sign;
    check: typeof check;
    verify: typeof _jwt.verify;
    decode: typeof _jwt.decode;
    catchErrors: typeof catchErrors;
};
export default _default;
