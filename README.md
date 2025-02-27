# koa-micro-ts

Microservice framework based on koa

```
   _                               _                      _
  | | _____   __ _       _ __ ___ (_) ___ _ __ ___       | |_ ___
  | |/ / _ \ / _` |_____| '_ ` _ \| |/ __| '__/ _ \ _____| __/ __|
  |   < (_) | (_| |_____| | | | | | | (__| | | (_) |_____| |_\__ \
  |_|\_\___/ \__,_|     |_| |_| |_|_|\___|_|  \___/       \__|___/

     Koa TypeScript Microservice Framework - batteries included
```

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Git Issues][issues-img]][issues-url]
[![Closed Issues][closed-issues-img]][closed-issues-url]
[![Caretaker][caretaker-image]][caretaker-url]
[![MIT license][license-img]][license-url]

## Quick Start

This package provides a minimalistic, simple to use, [koa][koa-url] based micro
service template. A few common used middleware packages are already included. To
keep it small as possible, we added some own tiny libraries like CORS,
JWT-wrapper, auto routes, logger, validators, APIdoc, API-History Fallback.
Included middleware/libs:

- body parser (now configurable since version 3) - detailed docs for all
  bodyparser options [BODYPARSER.md](docs/BODYPARSER.md)
- basic router
- auto router - smart directory based auto-generation of routes - detailed docs
  [AUTOROUTES.md](docs/AUTOROUTES.md)
- CORS - detailed docs [CORS.md](docs/CORS.md)
- JWT - detailed docs [JWT.md](docs/JWT.md)
- static files serving - detailed docs [STATIC.md](docs/STATIC.md)
- API history fallback functionality [APIFALLBACK.md](docs/APIFALLBACK.md)
- validators - detailed docs [VALIDATORS.md](docs/VALIDATORS.md)
- health API endpoint - detailed docs [HEALTH.md](docs/HEALTH.md)
- graceful shutdown - detailed docs [SHUTDOWN.md](docs/SHUTDOWN.md)
- logger - detailed docs [LOGGER.md](docs/LOGGER.md)
- parsing command line arguments - detailed docs [ARGS.md](docs/ARGS.md)
- dev/production mode detection - see below in this README.md
- catch errors - detailed docs [CATCHERRORS.md](docs/CATCHERRORS.md)
- request stats - detailed docs [REQUESTSTATS.md](docs/REQUESTSTATS.md)
- integrated API doc - detailed docs [APIDOC.md](docs/APIDOC.md)

Most of these modules can be enabled with just **one line of code**.
Configuration is super simple and lets you create your micro service within
minutes.

## Version 4 - Breaking Change

`app.autoRoute()` is now an async function.

So you need to call it within an async/await block ... here an example:

```
const main = async () => {
  await app.autoRoute(path.join(__dirname, '/routes'), '/api/v1');
  ...
  app.start(3000);
}

main()
```

## Version 3 - Breaking Change

`app.bodyParser()` needs to be called now. Please call this before adding any
routes. This has a configuration object, detailed documentation on body parser
options can be found here [BODYPARSER.md](docs/BODYPARSER.md)

```
app.bodyParser({ multipart: true })
```

## Installation

```bash
$ npm install koa-micro-ts
```

## Usage

Here is an example how you can use `koa-micro-ts`. Depending on your use case
most of the things here are optional and only required if you want to use them:

```ts
import { app, Application } from "koa-micro-ts";
import { join } from "path";

// setting variables only for demo purposes.
// You can set this as environment variables
process.env.APP_NAME = "micro-service";
process.env.VERSION = "1.0.0";

// enable body parser (with desired options)
app.bodyParser({ multipart: true });

// enable helpth endpoint (defaults to  tow endpoints /live and /ready)
app.health();

// enable helmet (optional)
app.helmet();

// enable cors (optional)
app.cors();

// parse command line params (optional)
app.parseArgs();

// catch uncatched errors - must be 'used' before adding routes
app.catchErrors();

// set up static server (optional)
app.static(join(__dirname, "/public"));

// using router
const router: any = app.newRouter();

router.get("/route", (ctx: Application.Context, next: Application.Next) => {
  ctx.body = "OK from static route";
});

app.useRouter(router);

// enable gracefull shutdown (optional)
app.gracefulShutdown();

app.ready = true; // /health /ready endpoint now returns true
app.start(3000);
```

Have a look at the function reference [APP.md](docs/APP.md) for all options

### Auto-Routes

This is one of the smart features of this package:

`autoRoute` allows you to just write your API endpoints and place them into a
directory structure. When calling
`await app.autoRoute(...directory..., mountpoint)`, this directory will be
parsed recursivly and all TypeScript files with extension `.route.ts` are added
as routes. All routes then will be mounted to the given `mountpoint`. Your API
structure then matches exactly your directory structure. This makes writing and
maintaining your API endpoints super simple.

Detailed docs with examples can be found here:
[AUTOROUTES.md](docs/AUTOROUTES.md)

### Dev / Production Mode

The `app` instance has a `development` property that is set to true when
providing a `--dev` or `--development` argument during startup or if the
environment variable `DEVELOPMENT` exists.

You can use this property e.g. like this:

```
if (app.development) {
  ...
}
```

### Examples

The example in the path `examples` shows how to use `koa-micro-ts` and

- enable health endpoint
- enable helmet
- enable cors
- serving static pages
- using standard router
- using auto routes

#### Building Example App

```
git clone https://github.com/sebhildebrandt/koa-micro.git
cd koa-micro
npm install
npm run build-example
npm run example
```

Now try the following routes in your browser:

Static Page:

- `http://localhost:3000/`

Standard Routes

- `http://localhost:3000/route`
- `http://localhost:3000/route2`

Health Routes

- `http://localhost:3000/liveness`
- `http://localhost:3000/readyness`

Routes from autoRouter

- `http://localhost:3000/api/v1/`
- `http://localhost:3000/api/v1/hello/`
- `http://localhost:3000/api/v1/error/`
- `http://localhost:3000/api/v1/resource/?param=value`

## Advanced usage

As `koa-micro-ts` uses some external packages, you can also refer to the
documentation of the used packages to see their options:

- [koa-router][koa-router-url]
- [http-graceful-shutdown][gracefulShutdown-url]
- [koa-helmet][koa-helmet-url]

## License [![MIT license][license-img]][license-url]

> The [`MIT`][license-url] License (MIT)
>
> Copyright &copy; 2025 Sebastian Hildebrandt,
> [+innovations](http://www.plus-innovations.com).
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
>
> Further details see [LICENSE](LICENSE) file.

[license-url]: https://github.com/sebhildebrandt/systeminformation/blob/master/LICENSE
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[koa-url]: https://github.com/koajs/koa
[gracefulShutdown-url]: https://github.com/sebhildebrandt/http-graceful-shutdown
[koa-router-url]: https://github.com/koajs/router
[koa-helmet-url]: https://github.com/venables/koa-helmet
[npm-image]: https://img.shields.io/npm/v/koa-micro-ts.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-micro-ts
[downloads-image]: https://img.shields.io/npm/dm/koa-micro-ts.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/koa-micro-ts
[issues-img]: https://img.shields.io/github/issues/sebhildebrandt/koa-micro-ts.svg?style=flat-square
[issues-url]: https://github.com/sebhildebrandt/koa-micro-ts/issues
[closed-issues-img]: https://img.shields.io/github/issues-closed-raw/sebhildebrandt/koa-micro-ts.svg?style=flat-square&color=brightgreen
[closed-issues-url]: https://github.com/sebhildebrandt/koa-micro-ts/issues?q=is%3Aissue+is%3Aclosed
[daviddm-url]: https://david-dm.org/sebhildebrandt/koa-micro-ts
[daviddm-img]: https://img.shields.io/david/sebhildebrandt/koa-micro-ts.svg?style=flat-square
[lgtm-badge]: https://img.shields.io/lgtm/grade/javascript/g/sebhildebrandt/koa-micro-ts.svg?style=flat-square
[lgtm-badge-url]: https://lgtm.com/projects/g/sebhildebrandt/koa-micro-ts/context:javascript
[lgtm-alerts]: https://img.shields.io/lgtm/alerts/g/sebhildebrandt/koa-micro-ts.svg?style=flat-square
[lgtm-alerts-url]: https://lgtm.com/projects/g/sebhildebrandt/koa-micro-ts/alerts
[caretaker-url]: https://github.com/sebhildebrandt
[caretaker-image]: https://img.shields.io/badge/caretaker-sebhildebrandt-blue.svg?style=flat-square
