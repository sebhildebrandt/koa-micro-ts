'use strict';

const validator = {
  isEmail(str: string) {
    return (str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/) !== null);;
  },
  isUrl(str: string) {
    return str.length < 2083 && (str.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i) !== null);
  },
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
  isIPv4(str: string) {
    return validator.isIP(str) === 4;
  },
  isIPv6(str: string) {
    return validator.isIP(str) === 6;
  },
  isIPNet(str: string) {
    return validator.isIP(str) !== 0;
  },
  isAlpha(str: string) {
    return (str.match(/^[a-zA-Z]+$/) !== null);;
  },
  isAlphanumeric(str: string) {
    return (str.match(/^[a-zA-Z0-9]+$/) !== null);
  },
  isNumeric(str: string) {
    return (str.match(/^-?[0-9]+$/) !== null);
  },
  isNumber(n: string | number) {
    if (typeof n === 'string') {
      n = parseFloat(n);
    }
    return !isNaN(n) && isFinite(n);
  }
  ,
  isHex(str: string) {
    const re = /^([a-f0-9]{2})+$/;
    return (re.test(str.toLowerCase()) !== null);
  },
  isInt(n: string | number) {
    let floatVal = 0;
    let intVal = 0;
    if (typeof n === 'string') {
      floatVal = parseFloat(n);
      intVal = parseInt(n, 10);
    } else {
      floatVal = n;
      intVal = Math.trunc(n);
    }
    return (!isNaN(intVal) && (floatVal === intVal));
  },
  isDecimal(str: string) {
    return str !== '' && str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
  },
  isDate(str: string) {
    const intDate = Date.parse(str);
    return !isNaN(intDate);
  },
  isTime(str: string) {
    str = str.trim();
    const parts = str.split(':');
    if (parts.length === 2 && str.length >= 3 && str.length <= 5) {
      const hours = parseInt(parts[0], 10);
      const mins = parseInt(parts[1], 10);
      return (hours >= 0 && hours <= 23 && mins >= 0 && mins <= 59)
    }
    return false;
  },
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
  isArray(str: string) {
    return typeof str === 'object' && Object.prototype.toString.call(str) === '[object Array]';
  },
  strip(str: string) {
    return str ? str.replace(/^\s+/, '').replace(/\s+$/, '') : '';
  },
  stripTags(str: string) {
    return str ? str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi, '') : '';
  },
  stripScripts(str: string) {
    const ScriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>';
    return str ? str.replace(new RegExp(ScriptFragment, 'img'), '') : '';
  },
}

export default validator
