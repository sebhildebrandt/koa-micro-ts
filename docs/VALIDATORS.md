# Validators

`koa-micro-ts` comes wirh a set of simple validators that you can use to check query and body params:

- `isAlpha`: string ... contains only a-z, A-Z
- `isAlphanumeric`: string ...contains only a-z, A-Z and 0-9
- `isNumeric`: string ... contains only 0-9
- `isNumber`: string|number ... is a number or can be converted to valid number
- `isHex`: string ...contains only a-f, A-F and 0-9
- `isInt`: string|number ... is integer value or converted value is integer
- `isDecimal`: string ... string represents a decimal
- `isDate`: string ... can be converted to date value
- `isTime`: string ... can be converted to time value
- `isEmail`: string ... structure seems to be valid email address
- `isUrl`: string ... structure seems to be valid URL
- `isIP`: string ... structure seems to be valid IP address
- `isIP4`: string ... structure seems to be valid IP4 address
- `isIP6`: string ... structure seems to be valid IP6 address
- `isUUID`: string, version ... structure seems to be valid UUID address (version can be 3, 'v3', 4, 'v4' or any other number)
- `isArray`: array ... tests if input is an array

Additionally `validator` has some basic strip functions to clean up input:

- `strip` strips all whitespaces
- `stripTags` strips all HTML tags like `<div></div>` or `<a></a>`
- `stripScripts`: strips all script tags like `<script>...</script>`

Here is an example how you can use the build-in validators:

```
import { validators } from 'koa-micro-ts';

const email = ctx.query.email || '';

if (validators.isEmail(email)) {
  ...
}
```
