declare const logLevel: {
    none: number;
    error: number;
    warn: number;
    trace: number;
    info: number;
    note: number;
    all: number;
};
interface logOptions {
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
    constructor(options?: logOptions);
    log: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    light: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    note: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    info: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    trace: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    warn: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    error: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    clear: (num: number) => void;
    private formatMessage;
}
export { Logger, logLevel, logOptions };
