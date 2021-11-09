import _jwt from 'jsonwebtoken';
declare const _default: {
    middleware: () => (ctx: any, next: any) => Promise<void>;
    init: (options: any) => void;
    sign: (claims: any, expiresIn: any) => string;
    check: (ctx: any) => Promise<any>;
    verify: typeof _jwt.verify;
    decode: typeof _jwt.decode;
    catchErrors: (message?: any) => (ctx: any, next: any) => Promise<void>;
};
export default _default;
