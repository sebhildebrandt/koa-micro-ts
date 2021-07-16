# Startup Options

When starting your `koa-micro-ts` microservice, you can provide several startup options, e.g.

```
app.start({
  port: 3000,
  bodyParserOptions: {
    ...
  }
})
```

The `port` option is mandatory (but will fall back to 3000). Body parser options are optional. See all possible options and their defaults in the next chapter:

## Body Parser Options

During startup of your microservice, you can provide options for the integrated body parser. As `koa-body` is used in this package, the options are the same.

- `patchNode` {**Boolean**} Patch request body to Node's ctx.req, default `false`
- `patchKoa` {**Boolean**} Patch request body to Koa's ctx.request, default `true`
- `jsonLimit` {**String**|Integer} The byte (if integer) limit of the JSON body, default `1mb`
- `formLimit` {**String**|Integer} The byte (if integer) limit of the form body, default `56kb`
- `textLimit` {**String**|Integer} The byte (if integer) limit of the text body, default `56kb`
- `encoding` {**String**} Sets encoding for incoming form fields, default `utf-8`
- `multipart` {**Boolean**} Parse multipart bodies, default `false`
- `urlencoded` {**Boolean**} Parse urlencoded bodies, default `true`
- `text` {**Boolean**} Parse text bodies, such as XML, default `true`
- `json` {**Boolean**} Parse JSON bodies, default `true`
- `jsonStrict` {**Boolean**} Toggles co-body strict mode; if set to true - only parses arrays or objects, default `true`
- `includeUnparsed` {**Boolean**} Toggles co-body returnRawBody option; if set to true, for form encodedand and JSON requests the raw, unparsed requesty body will be attached to ctx.request.body using a Symbol, default `false`
- `formidable` {**Object**} Options to pass to the formidable multipart `parser`
