// ==================================================================================
// autoRoute.ts
// ----------------------------------------------------------------------------------
// Description:   loads routes based on definitions in server/routes/
//                for Node.js
// Copyright:     (c) 2021
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// Contributors:  -
// ----------------------------------------------------------------------------------
// Usage:
//
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

/**
 * ==================================================
 * Module Dependencies
 * ==================================================
 */

import Router from '@koa/router';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { mergeDeep, parseFileApiDoc } from './apiDoc';
import jwt from './jwt';
import { LogLevels } from './log';


const routerSuffixJs = '.route.js';
const routerSuffixTs = '.route.ts';

const readdirSyncRecursive = (filePath: string, allFiles: string[]) => {
  try {
    const stats = statSync(filePath);

    if (stats.isFile()) {
      // base case
      allFiles.push(filePath);
    } else if (stats.isDirectory()) {
      // induction step
      readdirSync(filePath).forEach((fileName) => {
        if ('.' !== fileName.substring(0, 1)) {
          readdirSyncRecursive(join(filePath, fileName), allFiles);
        }
      });
    }
  } catch (e) { }
};

/**
 * ==================================================
 * Get all routes
 * ==================================================
 */

export const autoRoute = async (app: any, routepath: string, mountpoint: string, auth?: boolean): Promise<void> => {
  mountpoint = mountpoint ?? '';
  auth = auth ?? false;

  const routes: any = new Router({
    prefix: mountpoint
  });
  const files: any = [];
  let docObj: any = app.apiDocObj;

  if (app && app.log && app.log.level && app.log.level === LogLevels.all) {
    app.log.note('\n   Auto-Install Routes: (' + (auth ? 'private/auth' : 'public') + ')\n   Path: ' + routepath + '\n', false, false);
  }
  readdirSyncRecursive(routepath, files);

  for (const file of files) {
    const root = routepath;
    if (file.endsWith(routerSuffixJs) || file.endsWith(routerSuffixTs)) {


      const relfile = file.substring(root.length, 1000);

      const fileName = join(root, relfile);

      if (app.apiDoc) {
        const doc = parseFileApiDoc(fileName, auth) || {};
        docObj = mergeDeep(docObj, doc);
      }

      // const obj = require(fileName);
      const obj = await import(fileName);

      let method: string;
      let url: string;

      // generate routes based
      // on the exported methods
      for (const key in obj) {
        // if (obj.hasOwnProperty(key)) {
        url = relfile;
        if (url.endsWith(routerSuffixJs)) {
          url = url.substring(url.length - routerSuffixJs.length, 0);
        }
        if (url.endsWith(routerSuffixTs)) {
          url = url.substring(url.length - routerSuffixTs.length, 0);
        }
        if ('index' === url.substr(url.length - 5)) {
          url = url.substring(url.length - 5, 0);
        }

        // "reserved" exports
        // --if (~['name', 'prefix', 'engine', 'before', 'hidden'].indexOf(key)) continue;

        // route exports
        switch (key) {
          case 'list':
            method = 'get';
            break;
          case 'get':
            method = 'get';
            url = join(url, '/get');
            break;
          case 'detail':
            method = 'get';
            url = join(url, '/:id');
            break;
          case 'detail_detail':
            method = 'get';
            url = join(url, '/:id/:id2');
            break;
          case 'detail_detail_detail':
            method = 'get';
            url = join(url, '/:id/:id2/:id3');
            break;
          case 'index':
            method = 'get';
            break;
          case 'star':
            method = 'get';
            url = join(url, '/*');
            break;
          case 'set':
            method = 'get';
            url = join(url, '/set');
            break;
          case 'post':
            method = 'post';
            break;
          case 'post_detail':
            method = 'post';
            url = join(url, '/:id');
            break;
          case 'post_detail_detail':
            method = 'post';
            url = join(url, '/:id/:id2');
            break;
          case 'post_detail_detail_detail':
            method = 'post';
            url = join(url, '/:id/:id2/:id3');
            break;
          case 'put':
            method = 'put';
            break;
          case 'put_detail':
            method = 'put';
            url = join(url, '/:id');
            break;
          case 'put_detail_detail':
            method = 'put';
            url = join(url, '/:id/:id2');
            break;
          case 'put_detail_detail_detail':
            method = 'put';
            url = join(url, '/:id/:id2/:id3');
            break;
          case 'delete_detail':
            method = 'delete';
            url = join(url, '/:id');
            break;
          case 'delete_detail_detail':
            method = 'delete';
            url = join(url, '/:id/:id2');
            break;
          case 'delete_detail_detail_detail':
            method = 'delete';
            url = join(url, '/:id/:id2/:id3');
            break;
          default:
            // throw new Error('unrecognized route: ' + relfile + '.' + key);
            method = '';
            url = '';
        }
        if (method) {
          url = url.replace(/\\/g, "/");;
          if (auth) {
            routes[method](url, jwt.middleware(), obj[key]);
          } else {
            routes[method](url, obj[key]);
          }
          if (app && app.log && app.log.level && app.log.level === LogLevels.all) {
            app.log.note('       ' + mountpoint + url + '   ---   ' + method + ' - Function: ' + key, false, false);
          }
          // }
        }
      }
    }
  }
  app.use(routes.routes()).use(routes.allowedMethods());
  if (app && app.log && app.log.level && app.log.level === LogLevels.all) {
    app.log.note('', false, false);
  }
  if (app.apiDoc) {
    app.apiDocObj = docObj;
  }
};
