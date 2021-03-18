declare const validator: {
    isNumeric(str: string): boolean;
    isNumber(n: any): boolean;
    isHex(str: string): boolean;
    isInt(str: string): boolean;
    isDecimal(str: string): false | RegExpMatchArray | null;
    isDate(str: string): boolean;
    isAlpha(str: string): boolean;
    isAlphanumeric(str: string): boolean;
};
export default validator;
