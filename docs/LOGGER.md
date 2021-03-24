# Logger

`koa-micro-ts` comes with a build in tiny logger.

You can use it like so:

```
import { app, logLevel } from 'koa-micro-ts';

...

const log = app.logger({
  level: logLevel.all      // highest level, log all
});
```

### Log Levels

Initialize the logger with one of the following log levels:

- `logLevel.none`: log nothing
- `logLevel.error`: log errors only
- `logLevel.warn`: add also warn messages
- `logLevel.trace`: add trace messages
- `logLevel.info`: add info messages
- `logLevel.notes`: add notes
- `logLevel.all`: log all messages

### Log Header

By default, each log message contains time stamp and log type (color coded). You can initialize your logger in a way to modify this header section:

```
const log = app.logger({
  level: logLevel.all,     // highest level, log all
  logTimestamp: true/false,
  logtype: true/false
});
```

Setting `logtype` or `logTimestamp` to false would omit this part of the header. If no header is printed, then the message itself would be color coded.

Additionally you can set this per log message: E.g. this message will show with a time stamp but without a log type:

```
log.error('Error message', true, false);
```

### Log to file

```
const log = app.logger({
  level: logLevel.all,      // highest level, log all
  destination: './log.txt'
});
```

If you add a `destination` option, all logs are streamed to this file.
