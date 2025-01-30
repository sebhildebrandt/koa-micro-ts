declare const mergeDeep: (target: any, source: any) => any;
declare const parseFileApiDoc: (fileName: string, secure: boolean) => any;
declare const healthDocObj: (healthPath: string, livePath: string) => {
    Health: {
        method: string;
        path: string;
        description: string;
        params: never[];
        bodyParams: never[];
        success: never[];
        successExample: string;
        error: string;
        errorExample: string;
    }[];
};
declare const statsDocObj: (statsPath: string) => {
    Stats: {
        method: string;
        path: string;
        description: string;
        params: never[];
        bodyParams: never[];
        success: never[];
        successExample: string;
        error: string;
        errorExample: string;
    }[];
};
declare const createHtml: (apiDocObj: any) => string;
export { createHtml, healthDocObj, mergeDeep, parseFileApiDoc, statsDocObj };
