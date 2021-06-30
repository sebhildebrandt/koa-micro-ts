import { app, Application, KoaMicro, LogLevels } from '../../dist/index';
import * as path from 'path';

// setting variables only for demo purposes.
// You can set this as environment variables
process.env.APP_NAME = 'example-service';
process.env.VERSION = '1.0.0';

// initialize logger
app.logger({
  level: LogLevels.all  // highest level, log all
});

// ------ Health API -------
// options example with own readyness function

let isReady = false;

setTimeout(() => {
  isReady = true;
}, 5000);

function readyPromise(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (isReady) {
      resolve(true);
    } else {
      reject(false)
    }
  })
};

// enable helpth endpoint (defaults to /health)
app.health({
  livePath: '/liveness',
  readyPath: '/readyness',
  isReady: readyPromise,
});

// readyness alternative:
// ----------------------
// you could also just set app.ready to true as soon as your appo is ready:
//
// setTimeout(() => {
//   app.ready = true;
// }, 5000);

// app.health({
//   livePath: '/liveness',
//   readyPath: '/readyness'
// });

// --------------- END HEALTH

// enable helmet (optional)
app.helmet();

// enable cors (optional)
app.cors();

// catch uncatched errors - must be 'used' before adding routes
app.catchErrors();

// set up static server (optional)
app.static(path.join(__dirname, '/public'));

// using router
const router: any = app.newRouter();

router.get('/route', (ctx: Application.Context, next: Application.Next) => {
  ctx.body = 'OK from static route';
});

router.get('/route2', (ctx: Application.Context, next: Application.Next) => {
  ctx.body = 'This is static route 2';
});

app.useRouter(router);

// turn on API DOC creation
app.apiDoc = '/api/doc';

// using autoRoute: use all routes in path /routes and mount it to /api/v1
app.autoRoute(path.join(__dirname, '/routes'), '/api/v1');

// get command line arguments with alias (example) - see docs
app.parseArgs({
  v: 'verbose'             // alias - alternative arg
});

// gracefull shutdown (optional)
app.gracefulShutdown({
  finally: () => {
    console.log();
    app.log.info('Server gracefully terminated');
  }
});

app.start(3000);
app.log.trace('Server started');
app.log.trace('Mode: ' + (app.development ? 'Development' : 'Production'));
