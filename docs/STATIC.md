# Static file server

You can easily enable static file serving with one single line. If you have your static files in e.g. `/public`, this will enable your static file serving:

```
app.static(path.join(__dirname, '/public'));
```

You can also add multiple directories and provide a mount point where the files should be accessable:

```
app.static(path.join(__dirname, '/images', { mountpoint: '/images' }));
app.static(path.join(__dirname, '/public'));
```

In this example
- your static files (which are in `public`) will be accessable from root (`/...`)
- your image files (which are in `images`) will be accessable from `/images/...`

If you are using `app.static` multiple times, be sure, that the one where `app.apiHistoryFallback()` should grab the fallback `index.html` (or what you defind in the options) is the last one. See also [APIFALLBACK.md](./APIFALLBACK.md)
