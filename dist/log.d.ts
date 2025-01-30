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
    log: (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => void;
    light: (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => void;
    note: (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => void;
    http: (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => void;
    info: (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => void;
    trace: (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => void;
    warn: (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => void;
    error: (msg?: string, forceTimestamp?: boolean, forceLogtype?: boolean) => void;
    clear: (num: number) => void;
    logLevel: () => number;
    private formatMessage;
}
export { iLogOptions, Logger, LogLevels };
