# Health Endpoint

You can easily configure an health endpoint that you can query to check if your microservice is still alive:

It can be enabled with this single line:

```
app.health()
```

### Configure Endpoint

The default health endpoint on your API will be `\health`;

If you want to specify a different mountpoint, just pass it as a string parameter, e.g.:

```
app.health('/alive')
```

### Options

This Endpoint will return the following JSON result object:

```
{
  name: 'APP_NAME',
  version: 'APP_VERSION',
  status: 'ok'
}
```

`APP_NAME` and `APP_VERSION` can be set as environment variables with the according name or you can pass it as an object to the health api like so:

```
app.health('/alive', {
  name: 'APP_NAME',
  version: 'APP_VERSION'
})
```
