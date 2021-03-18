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
  isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ,
  isHex(str: string) {
    const re = /^([a-fA-F0-9]{2})+$/;
    return (re.test(str) !== null);
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
  isDate(str: string) {
    const intDate = Date.parse(str);
    return !isNaN(intDate);
  }
}

export default validator