const ScriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>';

const strip = (str: string) => {
  return str ? str.replace(/^\s+/, '').replace(/\s+$/, '') : '';
};
const stripTags = (str: string) => {
  return str ? str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi, '') : '';
};
const stripScripts = (str: string) => {
  return str ? str.replace(new RegExp(ScriptFragment, 'img'), '') : '';
};

const validator = {
  isEmail(str: string) {
    return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
  },
  isUrl(str: string) {
    // A modified version of the validator from @diegoperini / https://gist.github.com/729294
    return str.length < 2083 && str.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);
  },
  isPath(str: string) {
    return str.length < 2083 && str.match(/^(?::\d{2,5})?(?:\/[^\s]*)?$/i);
  },
  // node-js-core
  isIP(str: string) {
    if (!str) {
      return 0;
    } else if (/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/.test(str)) {
      const parts = str.split('.');
      for (const part of parts) {
        const partInt = parseInt(part, 10);
        if (partInt < 0 || 255 < partInt) {
          return 0;
        }
      }
      return 4;
    } else if (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/.test(
      str)) {
      return 6;
    } else {
      return 0;
    }
  },
  // node-js-core
  isIPv4(str: string) {
    return validator.isIP(str) === 4;
  },
  // node-js-core
  isIPv6(str: string) {
    return validator.isIP(str) === 6;
  },
  isIPNet(str: string) {
    return validator.isIP(str) !== 0;
  },
  isAlpha(str: string) {
    return str.match(/^[a-zA-Z]+$/);
  },
  isAlphanumeric(str: string) {
    return str.match(/^[a-zA-Z0-9]+$/);
  },
  isAlphanumericExt(str: string) {
    return str.match(/^[a-zA-Z0-9_\-]+$/);
  },
  isUsername(str: string) {
    const m = str.match(/\S{2,30}$/);
    return m && m.index === 0;
  },
  isPassword(str: string) {
    return str.match(/^[a-zA-Z0-9_\-]{3,30}$/);
  },
  isPasswordExt(str: string) {
    return str.match(/^(?=.*[A-Z])(?=.*[!@#$&*_\-])(?=.*[0-9]).{8,20}$/);
  },
  isNumeric(str: string) {
    return str.match(/^-?[0-9]+$/);
  },
  isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  isHex(str: string) {
    const re = /^([a-fA-F0-9]{2})+$/;
    return (re.test(str));
  },
  isLowercase(str: string) {
    return str.match(/^[a-z0-9]+$/);
  },
  isUppercase(str: string) {
    return str.match(/^[A-Z0-9]+$/);
  },
  isInt(str: string) {
    const floatVal = parseFloat(str);
    const intVal = parseInt(str, 10);
    if (!isNaN(intVal) && (floatVal === intVal)) {
      return true;
    } else {
      return false;
    }
  },
  isDecimal(str: string) {
    return str !== '' && str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
  },
  isDivisibleBy(str: string, n: number) {
    return !(parseFloat(str) % n);
  },
  notNull(str: string) {
    return str !== '';
  },
  isNull(str: string) {
    return str === '';
  },
  notEmpty(str: string) {
    return !str.match(/^[\s\t\r\n]*$/);
  },
  equals(a: any, b: any) {
    return a === b;
  },
  contains(str: string, elem: string) {
    return str.indexOf(elem) >= 0;
  },
  notContains(str: string, elem: string) {
    return !validator.contains(str, elem);
  },
  regex(str: string, pattern: any, modifiers: string) {
    str += '';
    if (Object.prototype.toString.call(pattern).slice(8, -1) !== 'RegExp') {
      pattern = new RegExp(pattern, modifiers);
    }
    return str.match(pattern);
  },
  notRegex(str: string, pattern: any, modifiers: string) {
    return !validator.regex(str, pattern, modifiers);
  },
  len(str: string, min: number, max?: number) {
    return str.length >= min && (max === undefined || str.length <= max);
  },
  // Thanks to github.com/sreuter for the idea.
  isUUID(str: string, version: string | number) {
    let pattern;
    if (version === 3 || version === 'v3') {
      pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    } else if (version === 4 || version === 'v4') {
      pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    } else {
      pattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    }
    return str.match(pattern);
  },
  isDate(str: string) {
    const intDate = Date.parse(str);
    return !isNaN(intDate);
  },
  isAfter(str: string, date?: Date | string) {
    date = date || new Date();
    const origDate = Date.parse(str);
    const compDate = (date instanceof Date) ? date : Date.parse(date);
    return !(origDate && compDate && origDate <= compDate);
  },
  isBefore(str: string, date: Date | string) {
    date = date || new Date();
    const origDate = Date.parse(str);
    const compDate = (date instanceof Date) ? date : Date.parse(date);
    return !(origDate && compDate && origDate >= compDate);
  },
  // isIn(str, options) {
  //   let validOptions = options && typeof options.indexOf === 'function';
  //   return validOptions && ~options.indexOf(str);
  // },
  // notIn(str, options) {
  //   let validOptions = options && typeof options.indexOf === 'function';
  //   return validOptions && options.indexOf(str) === -1;
  // },
  min(str: string, val: number) {
    const num = parseFloat(str);
    return isNaN(num) || num >= val;
  },
  max(str: string, val: number) {
    const num = parseFloat(str);
    return isNaN(num) || num <= val;
  },
  isArray(str: string) {
    return typeof str === 'object' && Object.prototype.toString.call(str) === '[object Array]';
  },
  // Will work against Visa, MasterCard, American Express, Discover, Diners Club, and JCB card numbering formats
  isCreditCard(str: string) {
    // remove all dashes, spaces, etc.
    const sanitized = str.replace(/[^0-9]+/g, '');
    if (sanitized.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) === null) {
      return null;
    }
    // Doing Luhn check
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
    } else {
      return null;
    }
  },
  sanitize(str: string) {
    str = str.replace(/[<>";\\]/g, '');
    str = str.replace(/\.\./g, '');
    return str.trim();
  },
  strip,
  stripTags,
  stripScripts,
  stripAll(str: string) {
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

export default validator;
