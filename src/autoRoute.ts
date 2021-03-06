'use strict';

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

import path from 'path';
import Router from '@koa/router';
import jwt from './jwt';
import { Logger, LogLevels, iLogOptions } from './log';
import { parseFileApiDoc, mergeDeep } from './apiDoc';
import fs from 'fs';


const routerSuffixJs = '.route.js';
const routerSuffixTs = '.route.ts';

function readdirSyncRecursive(filePath: string, allFiles: string[]) {
  try {
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      // base case
      allFiles.push(filePath);
    } else if (stats.isDirectory()) {
      // induction step
      fs.readdirSync(filePath).forEach((fileName) => {
        if ('.' !== fileName.substring(0, 1)) {
          readdirSyncRecursive(path.join(filePath, fileName), allFiles);
        }
      });
    }
  } catch (e) { }
}

/**
 * ==================================================
 * Get all routes
 * ==================================================
 */

export function autoRoute(app: any, routepath: string, mountpoint: string, auth?: boolean): void {
  mountpoint = mountpoint || '';
  auth = auth || false;

  const routes: any = new Router({
    prefix: mountpoint
  });
  const files: any = [];
  let docObj: any = app.apiDocObj;
  // const root = path.dirname(require.main.filename);
  // const routepath = path.join(root, rpath);

  if (app && app.log && app.log.level && app.log.level === LogLevels.all) {
    app.log.trace('\n   Auto-Install Routes: (' + (auth ? 'private/auth' : 'public') + ')\n   Path: ' + routepath + '\n', false, false);
  }
  // clog.trace('\n   Auto-Install Routes: (' + (auth ? 'private/auth' : 'public') + ')\n   Path: ' + routepath + '\n');
  // console.log('\n   Auto-Install Routes: (' + (auth ? 'private/auth' : 'public') + ')\n   Path: ' + routepath + '\n');
  readdirSyncRecursive(routepath, files);

  for (const file of files) {
    const root = routepath;
    if (file.endsWith(routerSuffixJs) || file.endsWith(routerSuffixTs)) {


      const relfile = file.substring(root.length, 1000);

      const fileName = path.join(root, relfile);

      if (app.apiDoc) {
        const doc = parseFileApiDoc(fileName, auth) || {};
        docObj = mergeDeep(docObj, doc);
      }

      const obj = require(fileName);
      let method: string;
      let url: string;
      let admin: boolean;
      let all: boolean;

      // generate routes based
      // on the exported methods
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          admin = false;
          all = false;
          method = '';
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
              url = path.join(url, '/get');
              break;
            case 'detail':
              method = 'get';
              url = path.join(url, '/:id');
              break;
            case 'detail_detail':
              method = 'get';
              url = path.join(url, '/:id/:id2');
              break;
            case 'detail_detail_detail':
              method = 'get';
              url = path.join(url, '/:id/:id2/:id3');
              break;
            case 'index':
              method = 'get';
              break;
            case 'star':
              method = 'get';
              url = path.join(url, '/*');
              break;
            case 'set':
              method = 'get';
              url = path.join(url, '/set');
              break;
            case 'post':
              method = 'post';
              break;
            case 'post_detail':
              method = 'post';
              url = path.join(url, '/:id');
              break;
            case 'post_detail_detail':
              method = 'post';
              url = path.join(url, '/:id/:id2');
              break;
            case 'post_detail_detail_detail':
              method = 'post';
              url = path.join(url, '/:id/:id2/:id3');
              break;
            case 'put':
              method = 'put';
              break;
            case 'put_detail':
              method = 'put';
              url = path.join(url, '/:id');
              break;
            case 'put_detail_detail':
              method = 'put';
              url = path.join(url, '/:id/:id2');
              break;
            case 'put_detail_detail_detail':
              method = 'put';
              url = path.join(url, '/:id/:id2/:id3');
              break;
            case 'delete_detail':
              method = 'delete';
              url = path.join(url, '/:id');
              break;
            case 'delete_detail_detail':
              method = 'delete';
              url = path.join(url, '/:id/:id2');
              break;
            case 'delete_detail_detail_detail':
              method = 'delete';
              url = path.join(url, '/:id/:id2/:id3');
              break;
            default:
              throw new Error('unrecognized route: ' + relfile + '.' + key);
          }
          if (method) {
            url = url.replace(/\\/g, "/");;
            if (auth) {
              routes[method](url, jwt.middleware(), obj[key]);
            } else {
              routes[method](url, obj[key]);
            }
            if (app && app.log && app.log.level && app.log.level === LogLevels.all) {
              app.log.trace('       ' + mountpoint + url + '   ---   ' + method + ' - Function: ' + key, false, false);
            }
          }
        }
      }
    }
  }
  app.use(routes.routes()).use(routes.allowedMethods());
  if (app && app.log && app.log.level && app.log.level === LogLevels.all) {
    app.log.trace('', false, false);
  }
  if (app.apiDoc) {
    app.apiDocObj = docObj;
  }
};
