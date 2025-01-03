'use strict';

// ==================================================================================
// log.ts
// ----------------------------------------------------------------------------------
// Description:   console.log (color) library - configurable output levels
//                for Node.js
// Copyright:     (c) 2025
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
// 4: +info, 5: +http, 6: +note, 7: all (+ light, +log)
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

/**
 * ==================================================
 * Module Dependencies
 * ==================================================
 */

import { appendFileSync, createReadStream, createWriteStream, existsSync, mkdirSync, renameSync, rmSync, statSync } from 'fs';
import { join } from 'path';
import readline from 'readline';
import util from 'util';
import * as zlib from 'zlib';

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
  dark(s: string) {
    return (Dim + FgWhite + s + Reset);
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

const LogLevels = {
  none: 0,
  error: 1,
  warn: 2,
  trace: 3,
  info: 4,
  http: 5,
  note: 6,
  all: 7
};

interface iLogOptions {
  level?: number,
  logTimestamp?: boolean;
  logType?: boolean;
  logFileName?: string;
  logPath?: string;
  logFileMaxSize?: number | string;
  logFileMaxHistory?: number;
  logFileZipHistory?: boolean;

}

const str = (obj: any) => {
  if (typeof (obj) === 'object') {
    return util.inspect(obj, false, null);
  } else {
    return obj;
  }
};

const calcMacSize = (val: string | number): number => {
  let result = 0;
  if (typeof val === 'string') {
    result = parseInt(val);
    if (val.endsWith('k')) {
      result = result * 1024;
    }
    if (val.endsWith('m')) {
      result = result * 1024 * 1024;
    }
    if (val.endsWith('g')) {
      result = result * 1024 * 1024 * 1024;
    }
  }
  if (typeof val === 'number') {
    result = val;
  }
  return result;
};

const zipFile = (source: string, destination: string) => {
  const gzip = zlib.createGzip();
  const inFile = createReadStream(source);
  const outFile = createWriteStream(destination);
  inFile.on('end', function () {
    rmSync(source);
  });
  inFile.pipe(gzip).pipe(outFile);
};

class Logger {

  private logToFile = false;
  private fileStream: any;
  private logTimestamp = true;
  private logType = true;
  private logSize = 0;
  private logFileName = '';
  private logFileNameFull = '';
  private logPath = '';
  private logFileMaxSize = 0;
  private logFileMaxHistory = 12;
  private logFileZipHistory = false;
  private logFileExtHistory = '';

  private levels: any = {
    error: false,
    warn: false,
    trace: false,
    info: false,
    http: false,
    note: false,
    all: false,
  };
  private level = LogLevels.all;

  constructor(options?: iLogOptions) {
    this.level = options && (options.level || options.level === 0) ? options.level : LogLevels.all;
    this.logTimestamp = options ? (options.logTimestamp !== undefined ? options.logTimestamp : true) : true;
    this.logType = options ? (options.logType !== undefined ? options.logType : true) : true;
    this.logFileName = options && options.logFileName ? options.logFileName : this.logFileName;
    this.logPath = options && options.logPath ? options.logPath : this.logPath;
    this.logFileMaxSize = options && options.logFileMaxSize !== undefined ? calcMacSize(options.logFileMaxSize) : this.logFileMaxSize;
    this.logFileMaxHistory = options && options.logFileMaxHistory ? options.logFileMaxHistory : this.logFileMaxHistory;
    this.logFileZipHistory = options && options.logFileZipHistory !== undefined ? options.logFileZipHistory : this.logFileZipHistory;
    this.logFileExtHistory = this.logFileZipHistory ? '.gz' : '';

    let index = 0;
    if (this.level >= LogLevels.error) { this.levels.error = true; }
    if (this.level >= LogLevels.warn) { this.levels.warn = true; }
    if (this.level >= LogLevels.trace) { this.levels.trace = true; }
    if (this.level >= LogLevels.info) { this.levels.info = true; }
    if (this.level >= LogLevels.http) { this.levels.http = true; }
    if (this.level >= LogLevels.note) { this.levels.note = true; }
    if (this.level >= LogLevels.all) { this.levels.all = true; }

    if (this.logFileName) { // log to file
      this.logToFile = true;
      if (this.logPath) {
        mkdirSync(this.logPath, { recursive: true });
      }
      this.logFileNameFull = join(this.logPath, this.logFileName + '.log');
      try {
        const stats = statSync(this.logFileNameFull);
        this.logSize = stats.size;
      } catch {
        this.logSize = 0;
      }
    }
  }

  checkLogRotate() {
    // check size
    if (this.logFileMaxSize && this.logSize >= this.logFileMaxSize) {
      this.rotateFilesSync();
      if (this.logFileZipHistory) {
        // zip file
        const zipFileName = join(this.logPath, this.logFileName + '.1.log.gz');
        const zipFileSource = join(this.logPath, this.logFileName + '.0.log');
        renameSync(this.logFileNameFull, zipFileSource);
        zipFile(zipFileSource, zipFileName);
      } else {
        const newFileName = join(this.logPath, this.logFileName + '.1.log');
        renameSync(this.logFileNameFull, newFileName);
      }
      this.logSize = 0;
    }
  }

  rotateFilesSync() {
    for (let i = this.logFileMaxHistory; i >= 1; i--) {
      const oldFilename = join(this.logPath, `${this.logFileName}.${i}.log${this.logFileExtHistory}`);
      const newFilename = join(this.logPath, `${this.logFileName}.${i + 1}.log${this.logFileExtHistory}`);
      if (existsSync(oldFilename)) {
        if (i === this.logFileMaxHistory) {
          rmSync(oldFilename);
        } else {
          renameSync(oldFilename, newFilename);
        }
      }
    }
  }

  log = (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => { // white
    if (this.levels.all) {
      forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
      const logMsg = this.formatMessage(8, forceTimestamp, forceLogtype, msg || '');
      if (this.logToFile) {
        this.logSize += logMsg.length + 2;
        appendFileSync(this.logFileNameFull, logMsg);
        this.checkLogRotate();
      } else {
        console.log(logMsg);
      }
    }
  };

  light = (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => { // grey
    if (this.levels.all) {
      forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
      const logMsg = this.formatMessage(7, forceTimestamp, forceLogtype, msg || '');
      if (this.logToFile) {
        this.logSize += logMsg.length + 2;
        appendFileSync(this.logFileNameFull, logMsg);

        this.checkLogRotate();
      } else {
        console.log(logMsg);
      }
    }
  };

  note = (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => { // blue
    if (this.levels.note) {
      forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
      const logMsg = this.formatMessage(6, forceTimestamp, forceLogtype, msg || '');
      if (this.logToFile) {
        this.logSize += logMsg.length + 2;
        appendFileSync(this.logFileNameFull, logMsg);

        this.checkLogRotate();
      } else {
        console.log(logMsg);
      }
    }
  };

  http = (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => { // green
    if (this.levels.http) {
      forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
      const logMsg = this.formatMessage(5, forceTimestamp, forceLogtype, msg || '');
      if (this.logToFile) {
        this.logSize += logMsg.length + 2;
        appendFileSync(this.logFileNameFull, logMsg);

        this.checkLogRotate();
      } else {
        console.log(logMsg);
      }
    }
  };

  info = (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => { // green
    if (this.levels.info) {
      forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
      const logMsg = this.formatMessage(4, forceTimestamp, forceLogtype, msg || '');
      if (this.logToFile) {
        this.logSize += logMsg.length + 2;
        appendFileSync(this.logFileNameFull, logMsg);

        this.checkLogRotate();
      } else {
        console.log(logMsg);
      }
    }
  };

  trace = (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => { // cyan
    if (this.levels.trace) {
      forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
      const logMsg = this.formatMessage(3, forceTimestamp, forceLogtype, msg || '');
      if (this.logToFile) {
        this.logSize += logMsg.length + 2;
        appendFileSync(this.logFileNameFull, logMsg);

        this.checkLogRotate();
      } else {
        console.log(logMsg);
      }
    }
  };

  warn = (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => { // yellow
    if (this.levels.warn) {
      forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
      const logMsg = this.formatMessage(2, forceTimestamp, forceLogtype, msg || '');
      if (this.logToFile) {
        this.logSize += logMsg.length + 2;
        appendFileSync(this.logFileNameFull, logMsg);

        this.checkLogRotate();
      } else {
        console.log(logMsg);
      }
    }
  };

  error = (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => { // red
    if (this.levels.error) {
      forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
      forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
      const logMsg = this.formatMessage(1, forceTimestamp, forceLogtype, msg ?? '');
      if (this.logToFile) {
        this.logSize += logMsg.length + 2;
        appendFileSync(this.logFileNameFull, logMsg);

        this.checkLogRotate();
      } else {
        console.log(logMsg);
      }
    }
  };

  clear = (num: number) => {			// clears given lines of numbers in console
    if (!num) { num = 1; }
    for (let i = 0; i < num; i++) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearLine(process.stdout, 0);
    }
  };

  logLevel = () => {
    return this.level;
  };

  private formatMessage = (loglevel: number, forceTimestamp: boolean, forceLogtype: boolean, msg: string) => {
    let level = '';
    let l = 0;
    let timestamp = '';
    if (forceLogtype) {
      if (loglevel === 1) { level = this.logToFile ? 'ERROR' : chalk.red('ERROR'); l = 5; }
      if (loglevel === 2) { level = this.logToFile ? 'WARN' : chalk.yellow('WARN'); l = 4; }
      if (loglevel === 3) { level = this.logToFile ? 'TRACE' : chalk.blue('TRACE'); l = 5; }
      if (loglevel === 4) { level = this.logToFile ? 'INFO' : chalk.green('INFO'); l = 4; }
      if (loglevel === 5) { level = this.logToFile ? 'HTTP' : chalk.green('HTTP'); l = 4; }
      if (loglevel === 6) { level = this.logToFile ? 'NOTE' : chalk.cyan('NOTE'); l = 4; }
      if (loglevel === 7) { level = this.logToFile ? 'LOG' : chalk.grey('LOG'); l = 3; }
      if (loglevel === 8) { level = this.logToFile ? 'LOG' : chalk.white('LOG'); l = 3; }
    }
    if (forceTimestamp) {
      const now = new Date();
      const date = [now.getFullYear(), ('0' + (now.getMonth() + 1)).substr(-2), ('0' + now.getDate()).substr(-2)];
      const time = [('0' + now.getHours()).substr(-2), ('0' + now.getMinutes()).substr(-2), ('0' + now.getSeconds()).substr(-2)];
      // Return the formatted string
      timestamp = date.join("-") + " " + time.join(":");
    }
    const divider = this.logToFile ? '| ' : chalk.dark('| ');
    const header = (timestamp ? timestamp + ' ' + divider : '') + (level ? level + '         '.substr(0, 7 - l) + divider : '');

    if (!level && !this.logToFile) {
      if (loglevel === 1) { msg = chalk.red(msg); }
      if (loglevel === 2) { msg = chalk.yellow(msg); }
      if (loglevel === 3) { msg = chalk.blue(msg); }
      if (loglevel === 4) { msg = chalk.green(msg); }
      if (loglevel === 5) { msg = chalk.green(msg); }
      if (loglevel === 6) { msg = chalk.cyan(msg); }
      if (loglevel === 7) { msg = chalk.grey(msg); }
      if (loglevel === 8) { msg = chalk.white(msg); }
    }

    return ((header ? header + msg : msg) + (this.logToFile ? '\n' : ''));
  };

}

export {
  iLogOptions, Logger,
  LogLevels
};

