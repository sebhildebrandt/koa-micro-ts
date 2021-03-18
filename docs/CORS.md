# CORS

The following line enable CORS for your microservce:

```
app.cors();
```

### Options

For most of the cases the default options should be fine but you can provice additional options to set specific CORS settings:

| option         | default | Comments |
| -------------- | --------------------- | ---------------------- |
| origin | `Access-Control-Allow-Origin` header from request or `*` | String ... sets `Access-Control-Allow-Origin` |
| allowMethods |  ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'] | Array  ... sets `Access-Control-Allow-Methods` |
| allowHeaders | `Access-Control-Allow-Headers` from request | Array  ... sets `Access-Control-Allow-Headers` |
| exposeHeaders | - | Array  ... sets `Access-Control-Expose-Headers` |
| credentials | true | Boolean  ... sets `Access-Control-Allow-Credentials` |
| maxAge | 3600 (1h) | String | Number ... sets `Access-Control-Expose-Headers` in secords |

So you could set options like so:

```
app.cors({
  origin: '*',
	maxAge: 3600,
	credentials: false,
	allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS']
	allowHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
});
```
