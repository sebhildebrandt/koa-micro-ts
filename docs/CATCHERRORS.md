# Catch Errors

`koa-micro-ts` comes with a `catchErrors` functionality to catch all uncatched errors and provide proper information back to the client. To enable this functionality you only need to call this before adding any route:

```
app.catchErrors()
```

In case of an uncatched error, the server responds with this JSON object (sample output):

```
{
  "status":500,
  "code":"CODE_0001",
  "message":"FORCED ERROR",
  "description":"Error Description"
}
```

If logging is enabled, this message is also logged as a `logLevel.error` [LOGGER.md](LOGGER.md)
