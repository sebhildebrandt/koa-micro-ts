// ==================================================================================
// cors.ts
// ----------------------------------------------------------------------------------
// Description:   adding CORS headers
//                for Node.js
// Copyright:     (c) 2025
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// Contributors:  -
// ----------------------------------------------------------------------------------
// Usage:
//
// import cors from '@lib/cors';
// app.use(cors({
//    origin: ...             // String ... sets `Access-Control-Allow-Origin`, default is request Origin header
//    exposeHeaders: ...      // Array  ... sets `Access-Control-Expose-Headers`
//    maxAge: ...             // String | Number ... sets `Access-Control-Expose-Headers`
//    credentials: ...        // Boolean  ... sets `Access-Control-Allow-Credentials`
//    allowMethods: ...       // Array  ... sets `Access-Control-Allow-Methods`, default is ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS']
//    allowHeaders: ...       // Array  ... sets `Access-Control-Allow-Headers`
// }));
// returns an object with all CLI Arguments parsed
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

export default (options: any = {}) => {
  const defaultOptions: any = {
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
    credentials: true,
    maxAge: 3600 // 1h
  };

  // set defaultOptions to options
  for (const key in defaultOptions) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultOptions[key];
    }
  }

  return async (ctx?: any, next?: any) => {
    let origin;
    if (typeof options.origin === 'function') {
      origin = options.origin(ctx);
    } else {
      origin = options.origin || ctx.get('Access-Control-Allow-Origin') || '*';
    }
    if (!origin) {
      return await next();
    }

    // Access-Control-Allow-Methods
    ctx.set('Access-Control-Allow-Methods', options.allowMethods.join(','));
    // Access-Control-Allow-Origin
    ctx.set('Access-Control-Allow-Origin', origin);

    // Access-Control-Max-Age
    if (options.maxAge) {
      ctx.set('Access-Control-Max-Age', String(options.maxAge));
    }
    if (options.credentials === true) {
      ctx.set('Access-Control-Allow-Credentials', 'true');
    }
    // Access-Control-Allow-Headers
    if (options.allowHeaders) {
      ctx.set('Access-Control-Allow-Headers', options.allowHeaders.join(','));
    } else if (ctx.get('Access-Control-Request-Headers')) {
      ctx.set('Access-Control-Allow-Headers', ctx.get('Access-Control-Request-Headers'));
    }
    // Request
    if (options.exposeHeaders) {
      ctx.set('Access-Control-Expose-Headers', options.exposeHeaders.join(','));
    }

    if (ctx.method === 'OPTIONS') {
      ctx.status = 204; // No Content
    } else {
      await next();
    }
  };
};
