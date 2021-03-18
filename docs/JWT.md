# JSON Web Tokens (JWT)

## How to use

JWT initialization

```
jwt = app.jwt.init({
  algorithm: 'RS256',
  expires: 43200, // in seconds. Default: 12h
  privateKey: 'rs256.priv',
  publicKey: 'rs256.pub'
})
```

This returns the JWT object that can be used to work with JSON Web Tokens:

## securing route with JWT

```
router.get('/sample', jwt.middleware(), (ctx, next) => {
  ctx.body = 'JWT protected route';
});
```

## Options

```
const config: any = {
  algorithm: 'RS256',
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

#### Payload


#### Signing Token

##
