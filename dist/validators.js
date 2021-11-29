"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>';
const strip = (str) => {
    return str ? str.replace(/^\s+/, '').replace(/\s+$/, '') : '';
};
const stripTags = (str) => {
    return str ? str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi, '') : '';
};
const stripScripts = (str) => {
    return str ? str.replace(new RegExp(ScriptFragment, 'img'), '') : '';
};
const validator = {
    isEmail(str) {
        return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
    },
    isUrl(str) {
        return str.length < 2083 && str.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);
    },
    isPath(str) {
        return str.length < 2083 && str.match(/^(?::\d{2,5})?(?:\/[^\s]*)?$/i);
    },
    isIP(str) {
        if (!str) {
            return 0;
        }
        else if (/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/.test(str)) {
            const parts = str.split('.');
            for (const part of parts) {
                const partInt = parseInt(part, 10);
                if (partInt < 0 || 255 < partInt) {
                    return 0;
                }
            }
            return 4;
        }
        else if (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/.test(str)) {
            return 6;
        }
        else {
            return 0;
        }
    },
    isIPv4(str) {
        return validator.isIP(str) === 4;
    },
    isIPv6(str) {
        return validator.isIP(str) === 6;
    },
    isIPNet(str) {
        return validator.isIP(str) !== 0;
    },
    isAlpha(str) {
        return str.match(/^[a-zA-Z]+$/);
    },
    isAlphanumeric(str) {
        return str.match(/^[a-zA-Z0-9]+$/);
    },
    isAlphanumericExt(str) {
        return str.match(/^[a-zA-Z0-9_\-]+$/);
    },
    isUsername(str) {
        const m = str.match(/\S{2,30}$/);
        return m && m.index === 0;
    },
    isPassword(str) {
        return str.match(/^[a-zA-Z0-9_\-]{3,30}$/);
    },
    isPasswordExt(str) {
        return str.match(/^(?=.*[A-Z])(?=.*[!@#$&*_\-])(?=.*[0-9]).{8,20}$/);
    },
    isNumeric(str) {
        return str.match(/^-?[0-9]+$/);
    },
    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isHex(str) {
        const re = /^([a-fA-F0-9]{2})+$/;
        return (re.test(str));
    },
    isLowercase(str) {
        return str.match(/^[a-z0-9]+$/);
    },
    isUppercase(str) {
        return str.match(/^[A-Z0-9]+$/);
    },
    isInt(str) {
        const floatVal = parseFloat(str);
        const intVal = parseInt(str, 10);
        if (!isNaN(intVal) && (floatVal === intVal)) {
            return true;
        }
        else {
            return false;
        }
    },
    isDecimal(str) {
        return str !== '' && str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
    },
    isDivisibleBy(str, n) {
        return !(parseFloat(str) % n);
    },
    notNull(str) {
        return str !== '';
    },
    isNull(str) {
        return str === '';
    },
    notEmpty(str) {
        return !str.match(/^[\s\t\r\n]*$/);
    },
    equals(a, b) {
        return a === b;
    },
    contains(str, elem) {
        return str.indexOf(elem) >= 0;
    },
    notContains(str, elem) {
        return !validator.contains(str, elem);
    },
    regex(str, pattern, modifiers) {
        str += '';
        if (Object.prototype.toString.call(pattern).slice(8, -1) !== 'RegExp') {
            pattern = new RegExp(pattern, modifiers);
        }
        return str.match(pattern);
    },
    notRegex(str, pattern, modifiers) {
        return !validator.regex(str, pattern, modifiers);
    },
    len(str, min, max) {
        return str.length >= min && (max === undefined || str.length <= max);
    },
    isUUID(str, version) {
        let pattern;
        if (version === 3 || version === 'v3') {
            pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        }
        else if (version === 4 || version === 'v4') {
            pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        }
        else {
            pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        }
        return str.match(pattern);
    },
    isDate(str) {
        const intDate = Date.parse(str);
        return !isNaN(intDate);
    },
    isAfter(str, date) {
        date = date || new Date();
        const origDate = Date.parse(str);
        const compDate = (date instanceof Date) ? date : Date.parse(date);
        return !(origDate && compDate && origDate <= compDate);
    },
    isBefore(str, date) {
        date = date || new Date();
        const origDate = Date.parse(str);
        const compDate = (date instanceof Date) ? date : Date.parse(date);
        return !(origDate && compDate && origDate >= compDate);
    },
    min(str, val) {
        const num = parseFloat(str);
        return isNaN(num) || num >= val;
    },
    max(str, val) {
        const num = parseFloat(str);
        return isNaN(num) || num <= val;
    },
    isArray(str) {
        return typeof str === 'object' && Object.prototype.toString.call(str) === '[object Array]';
    },
    isCreditCard(str) {
        const sanitized = str.replace(/[^0-9]+/g, '');
        if (sanitized.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) === null) {
            return null;
        }
        let sum = 0;
        let digit;
        let tmpNum;
        let shouldDouble = false;
        for (let i = sanitized.length - 1; i >= 0; i--) {
            digit = sanitized.substring(i, (i + 1));
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += ((tmpNum % 10) + 1);
                }
                else {
                    sum += tmpNum;
                }
            }
            else {
                sum += tmpNum;
            }
            if (shouldDouble) {
                shouldDouble = false;
            }
            else {
                shouldDouble = true;
            }
        }
        if ((sum % 10) === 0) {
            return sanitized;
        }
        else {
            return null;
        }
    },
    sanitize(str) {
        str = str.replace(/[<>";\\]/g, '');
        str = str.replace(/\.\./g, '');
        return str.trim();
    },
    strip,
    stripTags,
    stripScripts,
    stripAll(str) {
        let result = strip(str);
        result = stripTags(result);
        result = stripScripts(result);
        result = result.replace(/["'`;]+/g, '');
        result = result.replace(/ select /ig, ' _select_ ');
        result = result.replace(/ update /ig, ' _update_ ');
        result = result.replace(/ drop /ig, ' _drop_ ');
        result = result.replace(/ create /ig, ' _create_ ');
        result = result.replace(/ insert /ig, ' _insert_ ');
        result = result.replace(/ delete /ig, ' _delete_ ');
        result = result.replace(/ and /ig, ' _and_ ');
        result = result.replace(/ or /ig, ' _or_ ');
        return result;
    }
};
exports.default = validator;
//# sourceMappingURL=validators.js.map