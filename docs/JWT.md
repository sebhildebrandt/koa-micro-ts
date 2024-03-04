# JSON Web Tokens (JWT)

## How to use

First, make sure, you created keys for JWT (see section **Certificate Creation**).

In your app you then need toinitialize your JWT function:

```
import { join } from 'path';

const jwt = app.jwt({
  algorithm: 'ES256',
  expires: 43200, // in seconds. Default: 12h
  privateKey: join(__dirname, '/rs256.priv'),
  publicKey: join(__dirname, '/rs256.pub')
})
```

This returns the JWT object that can be used to work with JSON Web Tokens:

## Securing route with JWT

```
router.get('/sample', jwt.middleware(), (ctx, next) => {
  ctx.body = 'JWT protected route';
});
```

## Use auto-route with JWT

To protect all directory based auto-generated routes from path `/controllers/protected`, call `autoRoute()` like this:

```
autoRoute(app, './controllers/protected', '/api', true);
```

This pickes up the previous generated `jwt` in when creating the routes. **ATTENTION** JWT initialization must come before you add a protected route.

## Options

```
const config: any = {
  algorithm: 'ES256',
  expires: 43200, // in seconds. Default: 12h
  privateKey: 'rs256.priv',
  publicKey: 'rs256.pub'
};
```

## Certificate Creation

#### RS256

```
openssl ecparam -genkey -name prime256v1 -noout -out rs256.priv
openssl ec -in rs256.priv -pubout -out rs256.pub

openssl req -x509 -new -key rs256.priv -out rs256.cert -subj "/CN=unused"
```

#### ES512

```
openssl ecparam -genkey -name secp521r1 -noout -out ec512.priv
openssl ec -in ec512.priv -pubout -out ec512.pub

openssl req -x509 -new -key ec512.priv -out ec512.cert -subj "/CN=unused"
```

## Providing JWT to client

#### Example Login, create payload and sign token

In your server app, you just export the initialized `jwt`-object. Your last couple of lines in the server.ts could look like so:

```
export {
    app,
    conf,
    jwt
};
```

This is an example login route that could be picked up by `autoRoutes()` ... see also [AUTOROUTES.md](AUTOROUTES.md)
```
import { validators } from 'koa-micro-ts';
import { jwt } from '../server';

exports.post = async (ctx: any, next: any) => {

  try {
    if (ctx.request?.type && ctx.request.type === 'application/json') {
      const body = ctx.request.body;
      const username = validators.stripAll(body.username) || '';
      const password = validators.stripAll(body.password) || '';
      if (username === 'root' && password === '1234') {

        // Payload provided to client
        const claim = {
          userId: 1,
          userName: 'root',
          userFirstname: 'Obi-Wan',
          userLastname: 'Kenobi'
        };
        const expiresIn = 15 * 86400; // 15 Days

        // Sign token
        ctx.body = { 'token': jwt.sign(claim, expiresIn) };
      } else {
          ctx.status = 401;
          ctx.body = { error: 401, description: 'wrong username or password!' };
      }
    } else {
      ctx.status = 400;
      ctx.body = { error: 400, description: 'bad request' };
    }
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 401, description: 'wrong username or password!' };
  }
};
```

User name and passworts can of yourse been retreived from your DB. The client then can store thhhe token and use it in every sent header.
