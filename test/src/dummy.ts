import { app, config } from '../../dist/application.js';
const a: number = 1;

console.log('DUMMY TEST')
console.log(a);

app.use(async (ctx: any) => {
  ctx.body = config;
})
app.listen(3000);
