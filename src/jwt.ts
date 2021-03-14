'use strict';

// ==================================================================================
// jwt.ts
// ----------------------------------------------------------------------------------
// Description:   jsonwebtoken wrapper (for koa)
//                for Node.js
// Copyright:     (c) 2021
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// Contributors:  -
// ----------------------------------------------------------------------------------
// Usage:
//
// - handles keys as provides in config
// - config default values
// - config: any = {
//     algorithm: 'RS256',
//     expires: 43200, // in seconds. Default: 12h
//     privateKey: 'rs256.priv',
//     publicKey: 'rs256.pub'
//   };
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

import _jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

let publicKey: any;
let privateKey: any;

const config: any = {
  algorithm: 'RS256',
  expires: 43200, // in seconds. Default: 12h
  privateKey: 'rs256.priv',
  publicKey: 'rs256.pub'
};

const JWT: any = {
  decode: _jwt.decode,
  sign: _jwt.sign,
  verify: (token: any, secret: any, opts: any) => {
    return new Promise((resolve, reject) => {
      _jwt.verify(token, secret, opts, (error, decoded) => {
        error ? reject(error) : resolve(decoded);
      });
    });
  }
};

function init(options: any) {
  config.algorithm = options.algorithm || config.algorithm;
  config.expires = options.expires || config.expires;
  config.privateKey = options.privateKey || config.privateKey;
  config.publicKey = options.publicKey || config.publicKey;

  if (!publicKey) {
    publicKey = fs.readFileSync(config.publicKey);
  }
  if (!privateKey) {
    privateKey = fs.readFileSync(config.privateKey);
  }
}

function middleware() {
  //  module.exports = function (opts) {

  const opts: any = {
    secret: publicKey,
    algorithm: config.algorithm
  };

  const middleWare = async function jwt(ctx: any, next: any) {
    let token;
    let msg;
    let user;
    let parts;
    let scheme;
    let credentials;
    let secret;

    if (opts.cookie && ctx.cookies.get(opts.cookie)) {
      token = ctx.cookies.get(opts.cookie);

    } else if (ctx.header.authorization) {
      parts = ctx.header.authorization.split(' ');
      if (parts.length === 2) {
        scheme = parts[0];
        credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        if (!opts.passthrough) {
          ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"\n');
        }
      }
    } else {
      if (!opts.passthrough) {
        ctx.throw(401, 'No Authorization header found\n');
      }
    }

    secret = (ctx.state && ctx.state.secret) ? ctx.state.secret : publicKey;
    if (!secret) {
      ctx.throw(401, 'Invalid secret\n');
    }

    ctx.jwt = JWT.decode(token);

    try {
      user = await JWT.verify(token, secret, opts);
    } catch (e) {
      msg = 'Invalid token' + (opts.debug ? ' - ' + e.message + '\n' : '\n');
    }

    if (user || opts.passthrough) {
      ctx.state = ctx.state || {};
      ctx.state[opts.key] = user;
      await next();
    } else {
      ctx.throw(401, msg);
    }
  };

  // middleWare.unless = unless;

  return middleWare;
}

function sign(claims: any, expiresIn: any) {
  expiresIn = expiresIn || config.expires || 3600;
  return _jwt.sign(claims, privateKey, { algorithm: config.algorithm, expiresIn });
}

async function check(ctx: any) {
  const opts: any = {
    // debug: 1,
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

  secret = (ctx.state && ctx.state.secret) ? ctx.state.secret : publicKey;
  if (secret && token) {
    try {
      ctx.jwt = JWT.decode(token);

      try {
        user = await JWT.verify(token, secret, opts);
        ctx.jwt.user = user;
      } catch (e) {
        msg = 'Invalid token' + (opts.debug ? ' - ' + e.message + '\n' : '\n');
        throw msg;
      }
    } catch (e) {
      ctx.jwt = {};
    }
  }
  return ctx.jwt;
}

const verify = _jwt.verify;
const decode = _jwt.decode;

function catchErrors(message?: any) {

  return async (ctx: any, next: any) => {
    try {
      await next(); // Attempt to go through the JWT Validator
    } catch (e) {
      if (e.status === 401) {
        // Prepare response to user.
        let errorMmessage = '401 Forbidden - Not authorized';
        if (e.message && e.name) {
          errorMmessage = e.message.replace(/(\r\n|\n|\r)/gm, '');
        }
        ctx.status = e.status;
        const forbidden = message || errorMmessage;

        ctx.body = typeof forbidden === 'function' ? forbidden.call(ctx, ctx) : forbidden;
        // throw e;
      } else {
        throw e; // Pass the error to the next handler since it wasn't a JWT error.
      }
    }
  };
}

export default {
  middleware,
  init,
  sign,
  check,
  verify,
  decode,
  catchErrors
};
