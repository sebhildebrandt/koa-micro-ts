# koa-micro
Microservice framework based on koa

```
    ____  _                  __         _
   / __ \| | _____   __ _   / / __ ___ (_) ___ _ __ ___
  / / _` | |/ / _ \ / _` | / / '_ ` _ \| |/ __| '__/ _ \
 | | (_| |   < (_) | (_| |/ /| | | | | | | (__| | | (_) |
  \ \__,_|_|\_\___/ \__,_/_/ |_| |_| |_|_|\___|_|  \___/
   \____/

     TypeScript Microservice Framework - based on koa

```

## Quick Start

This package provides a simple to use [koa][koa-url] based minimalistic micro service template. Most common used middleware packages or libraries are already included but still we try to be as small as possible. Included middleware:

- basic router
- auto router
- body parser
- CORS
- JWT
- static files serving
- health API endpoint
- graceful shutdown

Configuration is super simple and lets you create your micro service within minutes.

## TODOs

This is a work in progress project in early stage:

1. [ ] typescript einrichten
2. [ ] package.json
3. [ ] koa import & provide koa
4. [ ] koa router
5. [ ] eigenes CORS
6. [ ] eigenes JWT
7. [ ] http-graceful-shutdown
8. [ ] static
9. [ ] body parser
10. [ ] health api endpoint



### Installation

```bash
$ npm install @koa/micro
```

### Usage

some text

```ts
import { app } from '@koa/micro';

...
```

## License [![MIT license][license-img]][license-url]

>The [`MIT`][license-url] License (MIT)
>
>Copyright &copy; 2021 Sebastian Hildebrandt, [+innovations](http://www.plus-innovations.com).
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
>of this software and associated documentation files (the "Software"), to deal
>in the Software without restriction, including without limitation the rights
>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
>copies of the Software, and to permit persons to whom the Software is
>furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in
>all copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
>THE SOFTWARE.
>
>Further details see [LICENSE](LICENSE) file.

[license-url]: https://github.com/sebhildebrandt/systeminformation/blob/master/LICENSE
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[koa-url]: https://github.com/koajs/koa
