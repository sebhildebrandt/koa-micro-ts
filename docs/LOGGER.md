# Logger

`koa-micro-ts` comes with a build in tiny logger.

You can use it like so:

```
import { app, LogLevels } from 'koa-micro-ts';

...

app.logger({
  level: LogLevels.all      // highest level, log all
});

app.log.error('This is a error message');
```

### Log Levels

Initialize the logger with one of the following log levels:

- `LogLevels.none`: log nothing
- `LogLevels.error`: log errors only
- `LogLevels.warn`: add also warn messages
- `LogLevels.trace`: add trace messages
- `LogLevels.info`: add info messages
- `LogLevels.notes`: add notes
- `LogLevels.all`: log all messages

### Logging

After initializing, your app has an instance of the logger an can be used like so:

```
app.log.error('This is a error message (red)');
app.log.warn('This is a warn message (yellow)');
app.log.trace('This is a trace message (cyan)');
app.log.info('This is a info message (green )');
app.log.note('This is a note (blue)');
app.log.light('This is a simple message (light grey)');
app.log.log('This is a simple message (white)');
```

### Log Options

By default, each log message contains time stamp and log type (color coded). You can initialize your logger in a way to modify this header section:

```
app.logger({
  level: LogLevels.all,       // highest level, log all - this is the default
  logTimestamp: true/false,   // true is the default
  logtype: true/false         // true is the default
});

app.log.trace('This is a log message');
```

Setting `logtype` or `logTimestamp` to false would omit this part of the header. If no header is printed, then the message itself would be color coded.

Additionally you can set this per log message: E.g. this message will show with a time stamp but without a log type:

```
app.log.error('Error message', true, false);
```

### Log to file

```
app.logger({
  level: LogLevels.all,      // highest level, log all
  destination: './log.txt'
});

app.log.trace('This is a log message');
```

If you add a `destination` option, all logs are streamed to this file.
