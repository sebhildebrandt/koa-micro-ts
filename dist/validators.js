'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const validator = {
    isNumeric(str) {
        return (str.match(/^-?[0-9]+$/) !== null);
    },
    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isHex(str) {
        const re = /^([a-fA-F0-9]{2})+$/;
        return (re.test(str) !== null);
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
    isDate(str) {
        const intDate = Date.parse(str);
        return !isNaN(intDate);
    },
    isAlpha(str) {
        return (str.match(/^[a-zA-Z]+$/) !== null);
    },
    isAlphanumeric(str) {
        return (str.match(/^[a-zA-Z0-9]+$/) !== null);
    }
};
exports.default = validator;
//# sourceMappingURL=validators.js.map