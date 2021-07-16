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
export interface StartOptions {
    port: number;
    bodyParserOptions?: BodyParserOptions;
}
