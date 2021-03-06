declare const validator: {
    isEmail(str: string): boolean;
    isUrl(str: string): boolean;
    isIP(str: string): 0 | 4 | 6;
    isIPv4(str: string): boolean;
    isIPv6(str: string): boolean;
    isIPNet(str: string): boolean;
    isAlpha(str: string): boolean;
    isAlphanumeric(str: string): boolean;
    isNumeric(str: string): boolean;
    isNumber(n: string | number): boolean;
    isHex(str: string): boolean;
    isInt(n: string | number): boolean;
    isDecimal(str: string): false | RegExpMatchArray | null;
    isDate(str: string): boolean;
    isTime(str: string): boolean;
    isUUID(str: string, version: string | number): RegExpMatchArray | null;
    isArray(str: string): boolean;
    strip(str: string): string;
    stripTags(str: string): string;
    stripScripts(str: string): string;
};
export default validator;
