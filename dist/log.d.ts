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
declare function logger(options: logOptions): {
    clear: (num: number) => void;
    error: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    info: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    light: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    log: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    note: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    trace: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    warn: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
};
export { logger, logLevel, logOptions };
