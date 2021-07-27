'use strict';

// ==================================================================================
// static.ts
// ----------------------------------------------------------------------------------
// Description:   static file serve wrapper (for koa)
//                for Node.js
// Copyright:     (c) 2021
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// Contributors:  -
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

import { StaticServeOptions } from "./app.interface";
import send = require("koa-send");
import { resolve } from 'path';

function serve(root: string, opts?: StaticServeOptions) {
  opts = opts || {};
  if (opts.index !== false) opts.index = opts.index || 'index.html';
  opts.root = resolve(root);

  return async function serve(ctx: any, next: any) {
    let servePath = ctx.path;
    let mountPoint = '';
    if (opts && opts.mountPoint) {
      mountPoint = opts.mountPoint;
      if (mountPoint[0] !== '/') { mountPoint = '/' + mountPoint; }
      if (mountPoint.slice(-1) === '/') { mountPoint = mountPoint.slice(0, -1); }
    }
    let done = false

    if ((ctx.method === 'HEAD' || ctx.method === 'GET') && (!mountPoint || ctx.path.startsWith(mountPoint + '/') || ctx.path === mountPoint)) {
      console.log(servePath)
      console.log(mountPoint)
      servePath = servePath.substring(mountPoint.length) || '/';
      console.log(servePath)
      try {
        done = !!(await send(ctx, servePath, opts))
      } catch (err) {
        if (err.status !== 404) {
          throw err;
        }
      }
    }

    if (!done) {
      await next();
    }
  }
}

export {
  serve
}
