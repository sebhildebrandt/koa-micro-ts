import Application from 'koa';
import { app } from '../../dist/application';
import path from 'path';

process.env.APP_NAME = 'example-service';
process.env.VERSION = '1.0.0';

// enable helpth endpoint (defaults to /health)
app.health();

// enable helmet (optional)
app.helmet()

// enable cors (optional)
app.cors();

// set up static server (optional)
app.static(path.join(__dirname, '/static'));

// using router
const router: any = app.newRouter();

router.get('/route', (ctx: Application.Context, next: Application.Next) => {
  ctx.body = 'OK from static route';
});

router.get('/route2', (ctx: Application.Context, next: Application.Next) => {
  ctx.body = 'This is static route 2';
});

app.useRouter(router);

// using autoRoute: use all routes in path /api and mount it to /api/v1
app.autoRoute(path.join(__dirname, '/api'), '/api/v1');

// gracefull shutdown (optional)
app.gracefulShutdown({
  finally: () => {
    console.log();
    console.log('Server gracefully terminated');
  }
});

app.start(3000);
