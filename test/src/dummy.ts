import { app } from '../../dist/application.js';

app.health('/health');

app.use(async (ctx: any) => {
  ctx.body = { hello: 'world' };
})

app.gracefulShutdown();

app.start(3000);
