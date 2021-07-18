# API History Fallback

If you need the situation where in your static file serving you need to have a fallback to e.g. '/index.html', then this function can help. If you e.g. serve a angular app, then client routes are anyway handled by the angular client:

Here some best practices how to use this:

1. first attach all routes (e.g. `autoRoute()`)
2. then place your `static()` function
3. place the `apiHistoryFallback()` right after this.

The `apiHistoryFallback()` will then (if no route was hit and no file so far was found) serve this fallback file (`/index.html` within your static file folder is the default)

```
app.autoRoute('./routes', '/api/v1');

app.static('./public');
app.apiHistoryFallback();

```
| option         | default | Comments |
| -------------- | --------------------- | ---------------------- |
| index | `/index.html` | String ... sets the fallback route |
| ignore | `['/api', '/images']` or `/api`| Array or string of path patterns that should be ignored |

