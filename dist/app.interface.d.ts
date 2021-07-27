/// <reference types="node" />
import { ParameterizedContext } from "koa";
import { Stats } from "fs";
export interface KoaErrors {
    message: string;
    code?: string;
    description?: string;
}
export interface BodyParserOptions {
    patchNode?: boolean;
    patchKoa?: boolean;
    jsonLimit?: string | number;
    formLimit?: string | number;
    textLimit?: string | number;
    encoding?: string;
    multipart?: boolean;
    urlencoded?: boolean;
    text?: boolean;
    json?: boolean;
    jsonStrict?: boolean;
    includeUnparsed?: boolean;
    formidable?: any;
}
export interface FallbackOptions {
    index?: string;
    ignore?: string | string[];
}
declare type SetHeaders = (res: ParameterizedContext["res"], path: string, stats: Stats) => any;
export interface StaticServeOptions {
    maxAge?: number | undefined;
    immutable?: boolean | undefined;
    hidden?: boolean | undefined;
    root?: string | undefined;
    mountPoint?: string | undefined;
    index?: string | false | undefined;
    gzip?: boolean | undefined;
    brotli?: boolean | undefined;
    format?: boolean | undefined;
    setHeaders?: SetHeaders | undefined;
    extensions?: string[] | false | undefined;
}
export {};
