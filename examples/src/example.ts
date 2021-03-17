import Application from 'koa';
import { app } from '../../dist/application';
import path from 'path';

// enable helmet (optional)
app.health('/health');

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

// using autoRoute
app.autoRoute(path.join(__dirname, '/api'), '/api/v1');

// gracefull shutdown (optional)
app.gracefulShutdown({
  finally: () => {
    console.log();
    console.log('Server grathfully terminated');
  }
});

app.start(3000);
