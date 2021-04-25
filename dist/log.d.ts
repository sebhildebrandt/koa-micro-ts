declare const LogLevels: {
    none: number;
    error: number;
    warn: number;
    trace: number;
    info: number;
    note: number;
    all: number;
};
interface iLogOptions {
    level?: number;
    logTimestamp?: boolean;
    logType?: boolean;
    destination?: string;
}
declare class Logger {
    private logToFile;
    private fileStream;
    private logTimestamp;
    private logType;
    private levels;
    private level;
    constructor(options?: iLogOptions);
    log: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    light: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    note: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    info: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    trace: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    warn: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    error: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    clear: (num: number) => void;
    logLevel: () => number;
    private formatMessage;
}
export { Logger, LogLevels, iLogOptions };
