'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevels = exports.Logger = void 0;
const util_1 = __importDefault(require("util"));
const readline_1 = __importDefault(require("readline"));
const fs_1 = require("fs");
const path_1 = require("path");
const zlib = __importStar(require("zlib"));
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
    white(s) {
        return (Bright + FgWhite + s + Reset);
    },
    grey(s) {
        return (FgWhite + s + Reset);
    },
    dark(s) {
        return (Dim + FgWhite + s + Reset);
    },
    blue(s) {
        return (Bright + FgBlue + s + Reset);
    },
    green(s) {
        return (FgGreen + s + Reset);
    },
    cyan(s) {
        return (FgCyan + s + Reset);
    },
    yellow(s) {
        return (FgYellow + s + Reset);
    },
    red(s) {
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
exports.LogLevels = LogLevels;
const str = (obj) => {
    if (typeof (obj) === 'object') {
        return util_1.default.inspect(obj, false, null);
    }
    else {
        return obj;
    }
};
const calcMacSize = (val) => {
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
const zipFile = (source, destination) => {
    const gzip = zlib.createGzip();
    const inFile = (0, fs_1.createReadStream)(source);
    const outFile = (0, fs_1.createWriteStream)(destination);
    inFile.on('end', function () {
        (0, fs_1.rmSync)(source);
    });
    inFile.pipe(gzip).pipe(outFile);
};
class Logger {
    constructor(options) {
        this.logToFile = false;
        this.logTimestamp = true;
        this.logType = true;
        this.logSize = 0;
        this.logFileName = '';
        this.logFileNameFull = '';
        this.logPath = '';
        this.logFileMaxSize = 0;
        this.logFileMaxHistory = 12;
        this.logFileZipHistory = false;
        this.logFileExtHistory = '';
        this.levels = {
            error: false,
            warn: false,
            trace: false,
            info: false,
            http: false,
            note: false,
            all: false,
        };
        this.level = LogLevels.all;
        this.log = (msg, forceTimestamp, forceLogtype) => {
            if (this.levels.all) {
                forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
                forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
                const logMsg = this.formatMessage(8, forceTimestamp, forceLogtype, msg || '');
                if (this.logToFile) {
                    this.logSize += logMsg.length + 2;
                    (0, fs_1.appendFileSync)(this.logFileNameFull, logMsg);
                    this.checkLogRotate();
                }
                else {
                    console.log(logMsg);
                }
            }
        };
        this.light = (msg, forceTimestamp, forceLogtype) => {
            if (this.levels.all) {
                forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
                forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
                const logMsg = this.formatMessage(7, forceTimestamp, forceLogtype, msg || '');
                if (this.logToFile) {
                    this.logSize += logMsg.length + 2;
                    (0, fs_1.appendFileSync)(this.logFileNameFull, logMsg);
                    this.checkLogRotate();
                }
                else {
                    console.log(logMsg);
                }
            }
        };
        this.note = (msg, forceTimestamp, forceLogtype) => {
            if (this.levels.note) {
                forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
                forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
                const logMsg = this.formatMessage(6, forceTimestamp, forceLogtype, msg || '');
                if (this.logToFile) {
                    this.logSize += logMsg.length + 2;
                    (0, fs_1.appendFileSync)(this.logFileNameFull, logMsg);
                    this.checkLogRotate();
                }
                else {
                    console.log(logMsg);
                }
            }
        };
        this.http = (msg, forceTimestamp, forceLogtype) => {
            if (this.levels.http) {
                forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
                forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
                const logMsg = this.formatMessage(5, forceTimestamp, forceLogtype, msg || '');
                if (this.logToFile) {
                    this.logSize += logMsg.length + 2;
                    (0, fs_1.appendFileSync)(this.logFileNameFull, logMsg);
                    this.checkLogRotate();
                }
                else {
                    console.log(logMsg);
                }
            }
        };
        this.info = (msg, forceTimestamp, forceLogtype) => {
            if (this.levels.info) {
                forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
                forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
                const logMsg = this.formatMessage(4, forceTimestamp, forceLogtype, msg || '');
                if (this.logToFile) {
                    this.logSize += logMsg.length + 2;
                    (0, fs_1.appendFileSync)(this.logFileNameFull, logMsg);
                    this.checkLogRotate();
                }
                else {
                    console.log(logMsg);
                }
            }
        };
        this.trace = (msg, forceTimestamp, forceLogtype) => {
            if (this.levels.trace) {
                forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
                forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
                const logMsg = this.formatMessage(3, forceTimestamp, forceLogtype, msg || '');
                if (this.logToFile) {
                    this.logSize += logMsg.length + 2;
                    (0, fs_1.appendFileSync)(this.logFileNameFull, logMsg);
                    this.checkLogRotate();
                }
                else {
                    console.log(logMsg);
                }
            }
        };
        this.warn = (msg, forceTimestamp, forceLogtype) => {
            if (this.levels.warn) {
                forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
                forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
                const logMsg = this.formatMessage(2, forceTimestamp, forceLogtype, msg || '');
                if (this.logToFile) {
                    this.logSize += logMsg.length + 2;
                    (0, fs_1.appendFileSync)(this.logFileNameFull, logMsg);
                    this.checkLogRotate();
                }
                else {
                    console.log(logMsg);
                }
            }
        };
        this.error = (msg, forceTimestamp, forceLogtype) => {
            if (this.levels.error) {
                forceLogtype = forceLogtype === undefined ? this.logType : forceLogtype;
                forceTimestamp = forceTimestamp === undefined ? this.logTimestamp : forceTimestamp;
                const logMsg = this.formatMessage(1, forceTimestamp, forceLogtype, msg || '');
                if (this.logToFile) {
                    this.logSize += logMsg.length + 2;
                    (0, fs_1.appendFileSync)(this.logFileNameFull, logMsg);
                    this.checkLogRotate();
                }
                else {
                    console.log(logMsg);
                }
            }
        };
        this.clear = (num) => {
            if (!num) {
                num = 1;
            }
            for (let i = 0; i < num; i++) {
                readline_1.default.clearLine(process.stdout, 0);
                readline_1.default.cursorTo(process.stdout, 0);
                readline_1.default.moveCursor(process.stdout, 0, -1);
                readline_1.default.clearLine(process.stdout, 0);
            }
        };
        this.logLevel = () => {
            return this.level;
        };
        this.formatMessage = (loglevel, forceTimestamp, forceLogtype, msg) => {
            let level = '';
            let l = 0;
            let timestamp = '';
            if (forceLogtype) {
                if (loglevel === 1) {
                    level = this.logToFile ? 'ERROR' : chalk.red('ERROR');
                    l = 5;
                }
                if (loglevel === 2) {
                    level = this.logToFile ? 'WARN' : chalk.yellow('WARN');
                    l = 4;
                }
                if (loglevel === 3) {
                    level = this.logToFile ? 'TRACE' : chalk.blue('TRACE');
                    l = 5;
                }
                if (loglevel === 4) {
                    level = this.logToFile ? 'INFO' : chalk.green('INFO');
                    l = 4;
                }
                if (loglevel === 5) {
                    level = this.logToFile ? 'HTTP' : chalk.green('HTTP');
                    l = 4;
                }
                if (loglevel === 6) {
                    level = this.logToFile ? 'NOTE' : chalk.cyan('NOTE');
                    l = 4;
                }
                if (loglevel === 7) {
                    level = this.logToFile ? 'LOG' : chalk.grey('LOG');
                    l = 3;
                }
                if (loglevel === 8) {
                    level = this.logToFile ? 'LOG' : chalk.white('LOG');
                    l = 3;
                }
            }
            if (forceTimestamp) {
                const now = new Date();
                const date = [now.getFullYear(), ('0' + (now.getMonth() + 1)).substr(-2), ('0' + now.getDate()).substr(-2)];
                const time = [('0' + now.getHours()).substr(-2), ('0' + now.getMinutes()).substr(-2), ('0' + now.getSeconds()).substr(-2)];
                timestamp = date.join("-") + " " + time.join(":");
            }
            const divider = this.logToFile ? '| ' : chalk.dark('| ');
            const header = (timestamp ? timestamp + ' ' + divider : '') + (level ? level + '         '.substr(0, 7 - l) + divider : '');
            if (!level && !this.logToFile) {
                if (loglevel === 1) {
                    msg = chalk.red(msg);
                }
                if (loglevel === 2) {
                    msg = chalk.yellow(msg);
                }
                if (loglevel === 3) {
                    msg = chalk.blue(msg);
                }
                if (loglevel === 4) {
                    msg = chalk.green(msg);
                }
                if (loglevel === 5) {
                    msg = chalk.green(msg);
                }
                if (loglevel === 6) {
                    msg = chalk.cyan(msg);
                }
                if (loglevel === 7) {
                    msg = chalk.grey(msg);
                }
                if (loglevel === 8) {
                    msg = chalk.white(msg);
                }
            }
            return ((header ? header + msg : msg) + (this.logToFile ? '\n' : ''));
        };
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
        if (this.level >= LogLevels.error) {
            this.levels.error = true;
        }
        if (this.level >= LogLevels.warn) {
            this.levels.warn = true;
        }
        if (this.level >= LogLevels.trace) {
            this.levels.trace = true;
        }
        if (this.level >= LogLevels.info) {
            this.levels.info = true;
        }
        if (this.level >= LogLevels.http) {
            this.levels.http = true;
        }
        if (this.level >= LogLevels.note) {
            this.levels.note = true;
        }
        if (this.level >= LogLevels.all) {
            this.levels.all = true;
        }
        if (this.logFileName) {
            this.logToFile = true;
            if (this.logPath) {
                (0, fs_1.mkdirSync)(this.logPath, { recursive: true });
            }
            this.logFileNameFull = (0, path_1.join)(this.logPath, this.logFileName + '.log');
            try {
                const stats = (0, fs_1.statSync)(this.logFileNameFull);
                this.logSize = stats.size;
            }
            catch (_a) {
                this.logSize = 0;
            }
        }
    }
    checkLogRotate() {
        if (this.logFileMaxSize && this.logSize >= this.logFileMaxSize) {
            this.rotateFilesSync();
            if (this.logFileZipHistory) {
                const zipFileName = (0, path_1.join)(this.logPath, this.logFileName + '.1.log.gz');
                const zipFileSource = (0, path_1.join)(this.logPath, this.logFileName + '.0.log');
                (0, fs_1.renameSync)(this.logFileNameFull, zipFileSource);
                zipFile(zipFileSource, zipFileName);
            }
            else {
                const newFileName = (0, path_1.join)(this.logPath, this.logFileName + '.1.log');
                (0, fs_1.renameSync)(this.logFileNameFull, newFileName);
            }
            this.logSize = 0;
        }
    }
    rotateFilesSync() {
        for (let i = this.logFileMaxHistory; i >= 1; i--) {
            const oldFilename = (0, path_1.join)(this.logPath, `${this.logFileName}.${i}.log${this.logFileExtHistory}`);
            const newFilename = (0, path_1.join)(this.logPath, `${this.logFileName}.${i + 1}.log${this.logFileExtHistory}`);
            if ((0, fs_1.existsSync)(oldFilename)) {
                if (i === this.logFileMaxHistory) {
                    (0, fs_1.rmSync)(oldFilename);
                }
                else {
                    (0, fs_1.renameSync)(oldFilename, newFilename);
                }
            }
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=log.js.map