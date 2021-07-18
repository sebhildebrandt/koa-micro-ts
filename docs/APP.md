# APP

### Koa-micro App Interface

This is the most simple app (which propably would not really do anything):

```
import { app, LogLevels } from 'koa-micro-ts';
app.start(3000);
```

But `koa-micro-ts` has some powerfull options to be able to create your microservice as fast as possible.

Here you can see the simple __functions interface__:

| function | Comment | example |
|---------|---------|---------|
| bodyParser(options) | enable body parser <br>Detailed docs [BODYPARSER.md](BODYPARSER.md) | app.bodyParser();|
| health(options) | Add a health endpoints. Standard path<br>is `/live` and `/ready` but you can add your own endpoint<br> path when using the optional parameters<br>Detailed docs [HEALTH.md](HEALTH.md) | app.health();<br> app.health({<br>&nbsp;&nbsp;livePath: '/alive'<br>&nbsp;&nbsp;readyPath: '/ready'<br>}); |
| helmet() | Enables helmet middleware | app.helmet(); |
| static(filepath) | If you have also static files which should<br>be served by your micro-service, just use<br>this function with the filepath of<br>the static files as a parameter | app.static(<br>&nbsp;&nbsp;path.join(__dirname, '/public')<br>); |
| apiHistoryFallback(options) | Enables API History Fallback middleware<br>Detailed docs [APIFALLBACK.md](APIFALLBACK.md) | app.apiHistoryFallback(); |
| cors(options) | Enables CORS middleware<br>Detailed docs [CORS.md](CORS.md) | app.cors(); |
| jwt(options) | Enables JWT middleware<br>Detailed docs [JWT.md](JWT.md) | app.jwt(); |
| gracefulShutdown(options) | Enables gracefulShutdown<br>Detailed docs [SHUTDOWN.md](SHUTDOWN.md) | app.gracefulShutdown(); |
| logger(options) | Enables logger middleware<br>Detailed docs [LOGGER.md](LOGGER.md) | app.logger();<br>app.logger({<br>&nbsp;&nbsp;level: LogLevels.warn,<br>&nbsp;&nbsp;destination: './server.log'<br>});|
| catchErrors() | Catch uncatched errors middleware | app.catchErrors(); |
| autoRoute(options) | Create routes for all controllers in<br>given path.<br>Detailed docs [AUTOROUTES.md](AUTOROUTES.md) | app.autoRoute(<br>&nbsp;&nbsp;'./controllers',<br>&nbsp;&nbsp;'/api/v1'<br>); |
| start(port) | Starts the server with the given port | app.start(3000); |
| close() | Close server | app.close(); |


