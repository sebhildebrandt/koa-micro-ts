declare function log(level: any, logTimestamp?: boolean, logtype?: boolean): {
    clear: (num: number) => void;
    error: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    info: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    levels: any;
    light: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    log: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    note: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    trace: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
    warn: (msg?: string | undefined, forceTimestamp?: boolean | undefined, forceLogtype?: boolean | undefined) => void;
};
export default log;
