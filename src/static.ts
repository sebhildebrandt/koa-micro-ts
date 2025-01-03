// ==================================================================================
// static.ts
// ----------------------------------------------------------------------------------
// Description:   static file serve wrapper (for koa)
//                for Node.js
// Copyright:     (c) 2025
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// Contributors:  -
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

import { resolve } from 'path';
import { StaticServeOptions } from "./app.interface";
const send = require("koa-send");

function serve(root: string, opts?: StaticServeOptions) {
  opts = opts ?? {};
  if (opts.index !== false) opts.index = opts.index ?? 'index.html';
  opts.root = resolve(root);

  return async function serve(ctx: any, next: any) {
    let servePath = ctx.path;
    let mountPoint = '';
    if (opts?.mountPoint) {
      mountPoint = opts.mountPoint;
      if (!mountPoint.startsWith('/')) { mountPoint = '/' + mountPoint; }
      if (mountPoint.endsWith('/')) { mountPoint = mountPoint.slice(0, -1); }
    }
    let done = false;

    if ((ctx.method === 'HEAD' || ctx.method === 'GET') && (!mountPoint || ctx.path.startsWith(mountPoint + '/') || ctx.path === mountPoint)) {
      servePath = servePath.substring(mountPoint.length) || '/';
      try {
        done = !!(await send(ctx, servePath, opts));
      } catch (err: any) {
        if (err.status !== 404) {
          throw err;
        }
      }
    }

    if (!done) {
      await next();
    }
  };
}

export {
  serve
};

