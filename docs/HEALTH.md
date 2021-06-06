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
  status: 'up'                 // 'up' for liveness or 'ready' for readyness endpoint
}
```

`APP_NAME` and `APP_VERSION` can be set as environment variables with the according name or you can pass it to the options object (see Options):


This will create two endpoints: `/live` and `/ready` (for liveness and readyness checks)
## Options

### Configure Endpoints

The default health endpoints on your API are be `/live` and `/ready` (for liveness and readyness checks);

If you want to specify different mountpoints, just pass it as an option parameter, e.g.:

```
app.health({
  livePath: '/liveness',
  readyPath: '/readyness'
})

```

### Other Options

To be able to determine, if your app is ready, you can pass a function promise to the options which should then return `true` or `false`:

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


app.health('/alive', {
  isReady: readyPromise
})
```

`APP_NAME` and `APP_VERSION` (which are displayed in the helth endpoint results) can be passed to the options:

```
app.health('/alive', {
  name: 'APP_NAME',
  version: 'APP_VERSION'
})
```
