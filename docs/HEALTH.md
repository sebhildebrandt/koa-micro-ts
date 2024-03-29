# Health Endpoint

You can easily configure an health endpoint that you can query to check if your microservice is still alive:

It can be enabled with this single line (but there are more options):

```
app.health()
```

This Endpoint will return the following JSON result object:

```
{
  name: 'APP_NAME',
  version: 'APP_VERSION',
  check: 'liveness',           // or 'readyness' when calling the readyness health endpoint
  status: 'up',                // 'up' for liveness or 'ready' for readyness health endpoint
  resultcode: 200
}
```

`APP_NAME` and `APP_VERSION` can be set as environment variables with the according name or you can pass it to the options object (see Options):

If the app is NOT yet `ready`, then the readayness endpoint will return a `503` status (and sents the above JSON object with `resultcode: 503`). See more

This will create two endpoints: `/live` and `/ready` (for liveness and readyness checks)
## Options

### Configure Endpoints

The default health endpoints on your API are be `/live` and `/ready` (for liveness and readyness checks);

If you want to specify different mountpoints, just pass it as an option parameter, e.g.:

```
app.health({
  livePath: '/api/health/live',
  readyPath: '/api/health/ready'
})

```

### Readyness Endpoint

To be able to determine, if your app is ready, you have two different options:

1. you can set the internal `app.ready` variable to true:

```
...
app.health();      // initialize health endpoints

await ... initialization ...

app.ready = true;  // after finishing initialization
...
```

2. or you can pass your own function promise to the options which should then return `true` or `false`:

```
function readyPromise(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if ( ... ready condition ... ) {
      resolve(true);
    } else {
      reject(false)
    }
  })
};

app.health({
  readyPath: '/readyness',
  isReady: readyPromise
})
```

### APP_NAME and APP_VERSION

If you do not set `APP_NAME` and `APP_VERSION` (which are displayed in the helth endpoint results) through ENV variables, they can be passed to the options:

```
app.health({
  livePath: '/liveness',
  readyPath: '/readyness',
  name: 'APP_NAME',
  version: 'APP_VERSION'
})
```

### All conficuration options

```
app.health({
  livePath: '/liveness',
  readyPath: '/readyness',
  isReady: readyPromise,    // promise that returns true or false
  name: 'APP_NAME',
  version: 'APP_VERSION'
})
```

