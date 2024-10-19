'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = require("fs");
let publicKey;
let privateKey;
const config = {
    algorithm: 'RS256',
    expires: 43200,
    privateKey: 'rs256.priv',
    publicKey: 'rs256.pub'
};
const JWT = {
    decode: jsonwebtoken_1.default.decode,
    sign: jsonwebtoken_1.default.sign,
    verify: (token, secret, opts) => {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, secret, opts, (error, decoded) => {
                error ? reject(error) : resolve(decoded);
            });
        });
    }
};
const init = (options) => {
    config.algorithm = options.algorithm || config.algorithm;
    config.expires = options.expires || config.expires;
    config.privateKey = options.privateKey || config.privateKey;
    config.publicKey = options.publicKey || config.publicKey;
    if (!publicKey) {
        publicKey = (0, fs_1.readFileSync)(config.publicKey);
    }
    if (!privateKey) {
        privateKey = (0, fs_1.readFileSync)(config.privateKey);
    }
};
const middleware = () => {
    const opts = {
        secret: publicKey,
        algorithm: config.algorithm
    };
    const middleWare = async (ctx, next) => {
        var _a;
        let token;
        let msg;
        let user;
        let parts;
        let scheme;
        let credentials;
        let secret;
        if (opts.cookie && ctx.cookies.get(opts.cookie)) {
            token = ctx.cookies.get(opts.cookie);
        }
        else if (ctx.header.authorization) {
            parts = ctx.header.authorization.split(' ');
            if (parts.length === 2) {
                scheme = parts[0];
                credentials = parts[1];
                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                }
            }
            else {
                if (!opts.passthrough) {
                    ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"\n');
                }
            }
        }
        else {
            if (!opts.passthrough) {
                ctx.throw(401, 'No Authorization header found\n');
            }
        }
        secret = ((_a = ctx.state) === null || _a === void 0 ? void 0 : _a.secret) ? ctx.state.secret : publicKey;
        if (!secret) {
            ctx.throw(401, 'Invalid secret\n');
        }
        ctx.jwt = JWT.decode(token);
        try {
            user = await JWT.verify(token, secret, opts);
        }
        catch (e) {
            msg = 'Invalid token' + (opts.debug ? ' - ' + e.message + '\n' : '\n');
        }
        if (user || opts.passthrough) {
            ctx.state = ctx.state || {};
            ctx.state[opts.key] = user;
            await next();
        }
        else {
            ctx.throw(401, msg);
        }
    };
    return middleWare;
};
const sign = (claims, expiresIn) => {
    expiresIn = expiresIn || config.expires || 3600;
    return jsonwebtoken_1.default.sign(claims, privateKey, { algorithm: config.algorithm, expiresIn });
};
const check = async (ctx) => {
    var _a;
    const opts = {
        secret: publicKey,
        algorithm: config.algorithm
    };
    let token;
    let msg;
    let parts;
    let scheme;
    let credentials;
    let secret;
    let user = {};
    if (ctx.header.authorization) {
        parts = ctx.header.authorization.split(' ');
        if (parts.length === 2) {
            scheme = parts[0];
            credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        }
    }
    secret = ((_a = ctx.state) === null || _a === void 0 ? void 0 : _a.secret) ? ctx.state.secret : publicKey;
    if (secret && token) {
        try {
            ctx.jwt = JWT.decode(token);
            try {
                user = await JWT.verify(token, secret, opts);
                ctx.jwt.user = user;
            }
            catch (e) {
                msg = 'Invalid token' + (opts.debug ? ' - ' + e.message + '\n' : '\n');
                throw msg;
            }
        }
        catch (e) {
            ctx.jwt = {};
        }
    }
    return ctx.jwt;
};
const verify = jsonwebtoken_1.default.verify;
const decode = jsonwebtoken_1.default.decode;
const catchErrors = (message) => {
    return async (ctx, next) => {
        try {
            await next();
        }
        catch (e) {
            if (e.status === 401) {
                let errorMmessage = '401 Forbidden - Not authorized';
                if (e.message && e.name) {
                    errorMmessage = e.message.replace(/(\r\n|\n|\r)/gm, '');
                }
                ctx.status = e.status;
                const forbidden = message || errorMmessage;
                ctx.body = typeof forbidden === 'function' ? forbidden.call(ctx, ctx) : forbidden;
            }
            else {
                throw e;
            }
        }
    };
};
exports.default = {
    middleware,
    init,
    sign,
    check,
    verify,
    decode,
    catchErrors
};
//# sourceMappingURL=jwt.js.map