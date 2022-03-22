declare const LogLevels: {
    none: number;
    error: number;
    warn: number;
    trace: number;
    info: number;
    http: number;
    note: number;
    all: number;
};
interface iLogOptions {
    level?: number;
    logTimestamp?: boolean;
    logType?: boolean;
    logFileName?: string;
    logPath?: string;
    logFileMaxSize?: number | string;
    logFileMaxHistory?: number;
    logFileZipHistory?: boolean;
}
declare class Logger {
    private logToFile;
    private fileStream;
    private logTimestamp;
    private logType;
    private logSize;
    private logFileName;
    private logFileNameFull;
    private logPath;
    private logFileMaxSize;
    private logFileMaxHistory;
    private logFileZipHistory;
    private logFileExtHistory;
    private levels;
    private level;
    constructor(options?: iLogOptions);
    checkLogRotate(): void;
    rotateFilesSync(): void;
    log: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    light: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    note: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    http: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    info: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    trace: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    warn: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    error: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    clear: (num: number) => void;
    logLevel: () => number;
    private formatMessage;
}
export { Logger, LogLevels, iLogOptions };
