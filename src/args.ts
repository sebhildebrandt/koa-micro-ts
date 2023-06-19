// ==================================================================================
// args.ts
// ----------------------------------------------------------------------------------
// Description:   tiny CLI args parser
//                for Node.js
// Copyright:     (c) 2023
// Author:        Sebastian Hildebrandt
// ----------------------------------------------------------------------------------
// Contributors:  -
// ----------------------------------------------------------------------------------
// Usage:
//
// import Args from './args';
// const args = parseArgs({
//   v: 'verbose'       // alternative arg
// });
// returns an object with all CLI Arguments parsed
// ----------------------------------------------------------------------------------
// License:       MIT
// ==================================================================================

export = (alias?: any) => {
  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  const args = process.argv.slice(2);

  const result: any = {};
  let current = 0;
  args.forEach((val, index) => {
    if (index === current) {
      current = index + 1;
      if (val.startsWith('--') && val.length > 2) {
        const param = val.substring(2, 100);
        if (args[index + 1] && !args[index + 1].startsWith('-') && args[index + 1].trim() !== '=') {
          result[param] = isNumeric(args[index + 1]) ? parseFloat(args[index + 1]) : args[index + 1];
          current++;
        } else {
          result[param] = true;
        }
      } else if (val.startsWith('-') && val.length > 1) {
        let part = '';
        for (let i = 1; i < val.length; i++) {
          part = val.substring(i, i + 1);
          if (alias && alias[part]) {
            part = alias[part];
          }
          result[part] = true;
        }
        if (args[index + 1] && !args[index + 1].startsWith('-') && args[index + 1].indexOf('=') === -1) {
          if (alias[part]) {
            part = alias[part];
          }
          result[part] = isNumeric(args[index + 1]) ? parseFloat(args[index + 1]) : args[index + 1];
          current++;
        }
      } else if (val.indexOf('=') >= 1) {
        const parts: string[] = val.split('=');
        if (alias[parts[0]]) {
          parts[0] = alias[parts[0]];
        }
        result[parts[0]] = isNumeric(parts[1]) ? parseFloat(parts[1]) : parts[1];
      } else {
        if (alias[val]) {
          val = alias[val];
        }
        result[val] = true;
      }
    }
  });
  return result;
};
