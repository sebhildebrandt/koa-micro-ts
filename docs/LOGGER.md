# Logger

`koa-micro-ts` comes with a build in tiny logger.

You can use it like so:

```
import { app, logger } from 'koa-micro-ts';

...

// Initialize it with log level:
// 0: nothing
// 1: errors only
// 2: warn messages
// 3: trace messages
// 4: info messages
// 5: notes
// 6: light messages
// 7: log messages

const log = logger(7) // log all levels
```

By default, each log message contains time stamp and log type (color coded). You can initialize your logger in a way to modify this header section:

````
const log = logger(logLevel: number, logTimestamp = true, logtype = true)
```

Setting `logtype` or `logTimestamp` to false would omit this part of the header. If no header is printed, then the message itself would be color coded.

Additionally you can set this per log message: E.g. this message will show with a time stamp but without a log type:

```
log.error('Error message', true, false);
```
