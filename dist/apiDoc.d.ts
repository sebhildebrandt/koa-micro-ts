declare function mergeDeep(target: any, ...sources: any): any;
declare function parseFileApiDoc(fileName: string, secure: boolean): any;
declare function healthDocObj(healthPath: string, livePath: string): {
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
declare function createHtml(apiDocObj: any): string;
export { parseFileApiDoc, healthDocObj, mergeDeep, createHtml };
