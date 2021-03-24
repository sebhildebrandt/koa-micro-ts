'use strict';

// ==================================================================================
// log.ts
// ----------------------------------------------------------------------------------
// Description:   console.log (color) library - configurable output levels
//                for Node.js
// Copyright:     (c) 2021
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// Contributors:  -
// ----------------------------------------------------------------------------------
// Usage:
//
// import { logger, logLevel, logOptions } from './log';
// const log = logger(options);
// log.trace('Hello World');
//
// configurable output levels:
// log can handle different types of configuration parameter
//
// parameter type example
// -------------------------------------
// number     the lower, the fewer output ...
// 0: nothing, 1: error only, 2: + warnings, 3: + trace
// 4: +info, 5: +note, 6: all (+ light, +log)
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

/**
 * ==================================================
 * Module Dependencies
 * ==================================================
 */

import util from 'util';
import readline from 'readline';
import fs, { WriteStream } from 'fs';
import path from 'path';

const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
const BgGreen = '\x1b[42m';
const BgYellow = '\x1b[43m';
const BgBlue = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan = '\x1b[46m';
const BgWhite = '\x1b[47m';

const chalk = {
  white(s: string) {
    return (Bright + FgWhite + s + Reset);
  },
  grey(s: string) {
    return (FgWhite + s + Reset);
  },
  blue(s: string) {
    return (Bright + FgBlue + s + Reset);
  },
  green(s: string) {
    return (FgGreen + s + Reset);
  },
  cyan(s: string) {
    return (FgCyan + s + Reset);
  },
  yellow(s: string) {
    return (FgYellow + s + Reset);
  },
  red(s: string) {
    return (FgRed + s + Reset);
  }
};

const logLevel = {
  none: 0,
  error: 1,
  warn: 2,
  trace: 3,
  info: 4,
  note: 5,
  all: 6
}

interface logOptions {
  level?: number,
  logTimestamp?: boolean;
  logType?: boolean;
  destination?: string;
}
function logger(options: logOptions) {

  const level = options.level || logLevel.all;
  const logTimestamp = options.logTimestamp !== undefined ? options.logTimestamp : true;
  const logType = options.logType !== undefined ? options.logType : true;
  const levels: any = {
    error: true,
    warn: true,
    trace: true,
    info: true,
    note: true,
    all: true,
  };

  let logToFile = false;
  let fileStream: any;

  let index = 0;
  if (Array.isArray(level)) {
    for (const property in levels) {
      if (levels.hasOwnProperty(property)) {
        levels[property] = level.indexOf(property) > -1;
        index++;
      }
    }
  }

  if (options.destination) { // log to file
    const file = path.parse(options.destination);
    logToFile = true;
    console.log(file);
    mkdirSync(file.dir);
    fileStream = fs.createWriteStream(options.destination, { flags: 'a' });
  }

  /**
   * ==================================================
   * Logging
   * ==================================================
   */

  function formatMessage(loglevel: number, forceTimestamp: boolean, forceLogtype: boolean, msg: string) {
    let level = '';
    let l = 0;
    let timestamp = '';
    if (forceLogtype) {
      if (loglevel === 1) { level = logToFile ? 'ERROR' : chalk.red('ERROR'); l = 5; }
      if (loglevel === 2) { level = logToFile ? 'WARN' : chalk.yellow('WARN'); l = 4; }
      if (loglevel === 3) { level = logToFile ? 'TRACE' : chalk.cyan('TRACE'); l = 5; }
      if (loglevel === 4) { level = logToFile ? 'INFO' : chalk.green('INFO'); l = 4; }
      if (loglevel === 5) { level = logToFile ? 'NOTE' : chalk.blue('NOTE'); l = 4; }
      if (loglevel === 6) { level = logToFile ? 'LOG' : chalk.grey('LOG'); l = 3; }
      if (loglevel === 7) { level = logToFile ? 'LOG' : chalk.white('LOG'); l = 3; }
    }
    if (forceTimestamp) {
      const now = new Date();
      const date = [now.getFullYear(), ('0' + (now.getMonth() + 1)).substr(-2), ('0' + now.getDate()).substr(-2)];
      const time = [('0' + now.getHours()).substr(-2), ('0' + now.getMinutes()).substr(-2), ('0' + now.getSeconds()).substr(-2)];
      // Return the formatted string
      timestamp = date.join("-") + " " + time.join(":");
    }
    const header = (timestamp ? timestamp + '  ' : '') + (level ? '[' + level + ']         '.substr(0, 7 - l) : '');

    if (!level && !logToFile) {
      if (loglevel === 1) { msg = chalk.red(msg) }
      if (loglevel === 2) { msg = chalk.yellow(msg) }
      if (loglevel === 3) { msg = chalk.cyan(msg) }
      if (loglevel === 4) { msg = chalk.green(msg) }
      if (loglevel === 5) { msg = chalk.blue(msg) }
      if (loglevel === 6) { msg = chalk.grey(msg) }
      if (loglevel === 7) { msg = chalk.white(msg) }
    }

    return ((header ? header + ': ' + msg : msg) + (logToFile ? '\n' : ''));
  }

  function str(obj: any) {
    if (typeof (obj) === 'object') {
      return util.inspect(obj, false, null);
    } else {
      return obj;
    }
  }

  function mkdirSync(p: string, opts?: any, made?: any) {
    const _0777 = parseInt('0777', 8);
    if (!opts || typeof opts !== 'object') {
      opts = { mode: opts };
    }

    let mode = opts.mode;
    const xfs = opts.fs || fs;

    if (mode === undefined) {
      // tslint:disable-next-line:no-bitwise
      mode = _0777 & (~process.umask());
    }
    if (!made) {
      made = null;
    }

    p = path.resolve(p);

    try {
      xfs.mkdirSync(p, mode);
      made = made || p;
    } catch (err0) {
      switch (err0.code) {
        case 'ENOENT':
          made = mkdirSync(path.dirname(p), opts, made);
          mkdirSync(p, opts, made);
          break;

        default:
          let stat;
          try {
            stat = xfs.statSync(p);
          } catch (err1) {
            throw err0;
          }
          if (!stat.isDirectory()) {
            throw err0;
          }
          break;
      }
    }
    return made;
  }

  function log(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // white
    if (levels.all) {
      forceLogtype = forceLogtype === undefined ? logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      const logMsg = formatMessage(7, forceTimestamp, forceLogtype, msg || '')
      if (logToFile) {
        fileStream.write(logMsg);
      } else {
        console.log(logMsg);
      }
    }
  }

  function light(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // grey
    if (levels.all) {
      forceLogtype = forceLogtype === undefined ? logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      const logMsg = formatMessage(6, forceTimestamp, forceLogtype, msg || '')
      if (logToFile) {
        fileStream.write(logMsg);
      } else {
        console.log(logMsg);
      }
    }
  }

  function note(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // blue
    if (levels.note) {
      forceLogtype = forceLogtype === undefined ? logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      const logMsg = formatMessage(5, forceTimestamp, forceLogtype, msg || '')
      if (logToFile) {
        fileStream.write(logMsg);
      } else {
        console.log(logMsg);
      }
    }
  }

  function info(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // green
    if (levels.info) {
      forceLogtype = forceLogtype === undefined ? logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      const logMsg = formatMessage(4, forceTimestamp, forceLogtype, msg || '')
      if (logToFile) {
        fileStream.write(logMsg);
      } else {
        console.log(logMsg);
      }
    }
  }

  function trace(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // cyan
    if (levels.trace) {
      forceLogtype = forceLogtype === undefined ? logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      const logMsg = formatMessage(3, forceTimestamp, forceLogtype, msg || '')
      if (logToFile) {
        fileStream.write(logMsg);
      } else {
        console.log(logMsg);
      }
    }
  }

  function warn(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // yellow
    if (levels.warn) {
      forceLogtype = forceLogtype === undefined ? logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      const logMsg = formatMessage(2, forceTimestamp, forceLogtype, msg || '')
      if (logToFile) {
        fileStream.write(logMsg);
      } else {
        console.log(logMsg);
      }
    }
  }

  function error(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // red
    if (levels.error) {
      forceLogtype = forceLogtype === undefined ? logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      const logMsg = formatMessage(1, forceTimestamp, forceLogtype, msg || '')
      if (logToFile) {
        fileStream.write(logMsg);
      } else {
        console.log(logMsg);
      }
    }
  }

  function clear(num: number) {			// clears given lines of numbers in console
    if (!num) { num = 1; }
    for (let i = 0; i < num; i++) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearLine(process.stdout, 0);
    }
  }

  return {
    clear,
    error,
    info,
    light,
    log,
    note,
    trace,
    warn
  };
}

export {
  logger,
  logLevel,
  logOptions
}
