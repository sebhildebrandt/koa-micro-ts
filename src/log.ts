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
// import Logger from '@lib/log';
// const log = Logger(options);
// log.trace('Hello World');
//
// configurable output levels:
// log can handle different types of configuration parameter
//
// parameter type example
// -------------------------------------
// object     { 'error': true, 'log': false, ... } Overwrites the default parameters
// array['error', 'warn']              Output only for the given log - types
// string     'error warn'                Output only for the given log - types(space - separated)
// number     the lower, the fewer output ...
// 0: nothing, 1: error only, 2: + warnings, 3: + trace
// 4: +info, 5: +note, 6: + light, 7: +log
// 7 results then in output everything
// boolean    true = everything   or false = nothing
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

/**
 * log
 *
 * parameters
 * @param level    configurable output levels
 * ==================================================
 */

function log(level: any, logTimestamp = true, logtype = true) {

  const levels: any = {
    error: true,
    warn: true,
    trace: true,
    info: true,
    note: true,
    light: true,
    log: true,
  };

  let index = 0;
  if (Array.isArray(level)) {
    for (const property in levels) {
      if (levels.hasOwnProperty(property)) {
        levels[property] = level.indexOf(property) > -1;
        index++;
      }
    }
  } else if ('string' === typeof level) {
    level = level.split(' ');
    for (const property in levels) {
      if (levels.hasOwnProperty(property)) {
        levels[property] = level.indexOf(property) > -1;
        index++;
      }
    }
  } else if ('object' === typeof level) {
    for (const property in level) {
      if (level.hasOwnProperty(property)) {
        levels[property] = level[property];
      }
    }
  } else if ('number' === typeof level) {
    for (const property in levels) {
      if (levels.hasOwnProperty(property)) {
        levels[property] = index < level;
        index++;
      }
    }
  } else if ('boolean' === typeof level) {
    for (const property in levels) {
      if (levels.hasOwnProperty(property)) {
        levels[property] = level;
        index++;
      }
    }
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
      if (loglevel === 1) { level = chalk.red('ERROR'); l = 5; }
      if (loglevel === 2) { level = chalk.yellow('WARN'); l = 4; }
      if (loglevel === 3) { level = chalk.cyan('TRACE'); l = 5; }
      if (loglevel === 4) { level = chalk.green('INFO'); l = 4; }
      if (loglevel === 5) { level = chalk.blue('NOTE'); l = 4; }
      if (loglevel === 6) { level = chalk.grey('LIGHT'); l = 5; }
      if (loglevel === 7) { level = chalk.white('LOG'); l = 3; }
    }
    if (forceTimestamp) {
      const now = new Date();
      const date = [now.getFullYear(), ('0' + (now.getMonth() + 1)).substr(-2), ('0' + now.getDate()).substr(-2)];
      const time = [('0' + now.getHours()).substr(-2), ('0' + now.getMinutes()).substr(-2), ('0' + now.getSeconds()).substr(-2)];
      // Return the formatted string
      timestamp = date.join("-") + " " + time.join(":");
    }
    const header = (timestamp ? timestamp + '  ' : '') + (level ? '[' + level + ']         '.substr(0, 7 - l) : '');

    if (!level) {
      if (loglevel === 1) { msg = chalk.red(msg) }
      if (loglevel === 2) { msg = chalk.yellow(msg) }
      if (loglevel === 3) { msg = chalk.cyan(msg) }
      if (loglevel === 4) { msg = chalk.green(msg) }
      if (loglevel === 5) { msg = chalk.blue(msg) }
      if (loglevel === 6) { msg = chalk.grey(msg) }
      if (loglevel === 7) { msg = chalk.white(msg) }
    }

    return (header ? header + ': ' + msg : msg);
  }

  function str(obj: any) {
    if (typeof (obj) === 'object') {
      return util.inspect(obj, false, null);
    } else {
      return obj;
    }
  }

  function log(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // white
    if (levels.log) {
      forceLogtype = forceLogtype === undefined ? logtype : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      console.log(formatMessage(7, forceTimestamp, forceLogtype, msg || ''));
    }
  }

  function light(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // grey
    if (levels.light) {
      forceLogtype = forceLogtype === undefined ? logtype : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      console.log(formatMessage(6, forceTimestamp, forceLogtype, msg || ''));
    }
  }

  function note(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // blue
    if (levels.note) {
      forceLogtype = forceLogtype === undefined ? logtype : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      console.log(formatMessage(5, forceTimestamp, forceLogtype, msg || ''));
    }
  }

  function info(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // green
    if (levels.info) {
      forceLogtype = forceLogtype === undefined ? logtype : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      console.log(formatMessage(4, forceTimestamp, forceLogtype, msg || ''));
    }
  }

  function trace(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // cyan
    if (levels.trace) {
      forceLogtype = forceLogtype === undefined ? logtype : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      console.log(formatMessage(3, forceTimestamp, forceLogtype, msg || ''));
    }
  }

  function warn(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // yellow
    if (levels.warn) {
      forceLogtype = forceLogtype === undefined ? logtype : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      console.log(formatMessage(2, forceTimestamp, forceLogtype, msg || ''));
    }
  }

  function error(msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) { // red
    if (levels.error) {
      forceLogtype = forceLogtype === undefined ? logtype : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? logTimestamp : forceTimestamp;
      console.log(formatMessage(1, forceTimestamp, forceLogtype, msg || ''));
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
    levels,
    light,
    log,
    note,
    trace,
    warn
  };
}

export default log;
