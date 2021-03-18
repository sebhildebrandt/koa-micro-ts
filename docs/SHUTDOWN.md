# Graceful Shutdown

`http-graceful-shutdown` manages a secure and save shutdown of your microservice application:

- tracks all connections
- stops the server from accepting new connections on shutdown
- graceful communication to all connected clients of server intention to shutdown
- immediately destroys all sockets without an attached HTTP request
- properly handles all HTTP and HTTPS connections
- possibility to define cleanup functions (e.g. closing DB connections)
- choose between shutting down by function call or triggered by SIGINT, SIGTERM, ...
- choose between final forcefull process termination node.js (process.exit) or clearing event loop (options).

## Quick Start

You can enable gracefull shutown by simply adding this on-liner:

```
app.gracefulShutdown();
```

## Options

To be more detailed about how this shutdown process acts, you can pass an options object with the following key/value pairs:

| option         | default | Comments |
| -------------- | --------------------- | ---------------------- |
| timeout | 30000 | timeout till forced shutdown (in milli seconds) |
| signals | 'SIGINT SIGTERM' | define the signals, that should be handled (separated by SPACE) |
| development | false | if set to true, no graceful shutdown is proceeded to speed up dev-process |
| onShutdown | - | not time consuming callback function. Needs to return a promise. |
| forceExit | true | force process.exit - otherwise just let event loop clear |
| finally | - | small, not time consuming function, that will<br>be handled at the end of the shutdown (not in dev-mode) |

### Option Explanation

- **timeout:** You can define the maximum time that the shutdown process may take (timeout option). If after this time, connections are still open or the shutdown process is still running, then the remaining connections will be forcibly closed and the server process is terminated.
- **signals** Here you can define which signals can trigger the shutdown process (SIGINT, SIGTERM, SIGKILL, SIGHUP, SIGUSR2, ...)
- **development** If true, the shutdown process is much shorter, because it just terminates the server, ignoring open connections, shutdown function, finally function ...
- **onShutdown** place your (not time consuming) callback function, that will handle your additional cleanup things (e.g. close DB connections). Needs to return a promise. (async). If you add an input parameter to your cleanup function (optional), the SIGNAL type that caused the shutdown is passed to your cleanup function. See example.
- **finally** here you can place a small (not time consuming) function, that will be handled at the end of the shutdown e.g. for logging of shutdown. (sync)
- **forceExit** force process.exit() at the end oof the shutdown process - otherwise just let event loop clear

### Example using Options

```
function shutdownFunction(signal) {
  return new Promise((resolve) => {
    console.log('... called signal: ' + signal);
    console.log('... in cleanup')
    setTimeout(function() {
      console.log('... cleanup finished');
      resolve();
    }, 1000)
  });
}

function finalFunction() {
  console.log('Server gracefulls shutted down.....')
}

app.gracefulShutdown(
  {
    signals: 'SIGINT SIGTERM',
    timeout: 10000,                  // timeout: 10 secs
    development: false,              // not in dev mode
    forceExit: false,                // no not triggers process.exit() at the end of shutdown process ... just let event loop clear
    onShutdown: shutdownFunction,    // shutdown function (async) - e.g. for cleanup DB, ... this function needs to return a promise
    finally: finalFunction           // finally function (sync) - e.g. for logging
  }
);
```


Detailed look at the docs of the underlying package can be found here:

[http-graceful-shutdown][gracefulShutdown-url]

[gracefulShutdown-url]: https://github.com/sebhildebrandt/http-graceful-shutdown
