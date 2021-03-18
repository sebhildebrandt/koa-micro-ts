# Auto-Routes

This is one of the smart features of this package:

`autoRoute` allows you to just write your API endpoints and place them into a directory structure. When calling `app.autoRoute(...directory..., mountpoint)`, this directory will be parsed recursivly and all TS files with extension `.route.ts` are added to as routes. All routes then will be mounted to the given `mountpoint`. Your API structure then matches exactly your directory structure. This makes writing and maintaining your API endpoints super simple.

```
DIRECTORY-STRUCTURE                                                      API-STRUCTURE

./routes                                                             /api/v1
  ├─ users                                                              ├─ users     (get)
  │    └─ index.route.ts                                                ├─ users/:id (get/:id)
  │       (containing get, get/:id, post, push/:id and delete/:id)      ├─ users     (post)
  │                                                                     ├─ users/:id (push)
  │                                                                     ├─ users/;id (delete)
  ├─ warehouse                                                          ├─ warehouse
  │    ├─ orders                                                        │    │
  │    │    └─ index.route.ts                                           │    ├─ orders ...
  │    └─ products                                                      │    │
  │    │    └─ index.route.ts                                           │    └─ products ...
  │                                                                     │
  └─ customers                                                          │
       └─ index.route.ts                                                └─ customers ...

```

Mount all routes with this on-liner:

```
app.autoRoute(path.join(__dirname, '/routes'), '/api/v1');
```

But how to set up the different methods? In the following chapter you see all examples:

## Examples

First, make sure, that you place your routes inside a dedicated directory e.g. `./routes` or `./controllers`

For each resource you may have a separate subdirectory (e.g. users, customers, orders, ...). Inside this directory just create a `index.route.ts` file.
### GET endpoint

Creating a simple get route is simple:

```
exports.index = async (ctx: any, next: any) => {
  ctx.body = {
    method: 'GET'
    message: 'simple get route - koa-micro-ts',
  }
)
```

#### Using query parameters

All query parameters are available in `ctx.query`. This get route wouls just return the get query parameters back to the client:

```
exports.index = async (ctx: any, next: any) => {
  ctx.body = {
    method: 'GET'
    query: ctx.query
  }
)
```

### GET /:id endpoint
Resource detail endpoint

Instead of exporting an async `index` function, you just exporting a `detail` function. Inside you easily can access the `id` parameter in `ctx.params.id`:

```
exports.detail = async (ctx: any, next: any) => {
  const id = ctx.params.id;   // this is the params ID

  ctx.body = {
    method: 'GET'
    paramsId: id;
  }
)
```

if you need somthing like `GET /:id/:id` you can just create a function line this:

```
exports.detail_detail = async (ctx: any, next: any) => {
  const id = ctx.params.id;   // this is the params ID
  const id2 = ctx.params.id2;   // this is the second params ID

  ctx.body = {
    method: 'GET'
    paramsId: id;
    paramsId2: id2;
  }
)
```

you can of yourse doi the same for `put`, `post`, and `delete` methods and this works up to three levels `/:id/:/id2/:id3`
### PUT endpoint

All other hethods are as simple as get entpoints. Just export an async function with the proper function name matching the method:


```
exports.put = async (ctx: any, next: any) => {

  const bodyData = ctx.request.body;    // this is your body data

  ctx.body = {
    method: 'PUT'
    bodyData: bodyData;
  }
)
```

### PUT /:id endpoint

PUT and POST will allow also accessing the alrealy parsed body in `ctx.request.body`

```
exports.put_detail = async (ctx: any, next: any) => {

  const id = ctx.params.id;   // this is the params ID
  const bodyData = ctx.request.body;    // this is your body data

  ctx.body = {
    method: 'PUT'
    paramsId: id;
    bodyData: bodyData;
  }
)
```

### POST endpoint

```
exports.post = async (ctx: any, next: any) => {

  const bodyData = ctx.request.body;    // this is your body data

  ctx.body = {
    method: 'POST'
    bodyData: bodyData;
  }
)
```


### POST /:id endpoint

```
exports.post_detail = async (ctx: any, next: any) => {

  const id = ctx.params.id;   // this is the params ID
  const bodyData = ctx.request.body;    // this is your body data

  ctx.body = {
    method: 'POST'
    paramsId: id;
    bodyData: bodyData;
  }
)
```

### DELETE endpoint

```
exports.delete = async (ctx: any, next: any) => {

  ctx.body = {
    method: 'DELETE'
  }
)
```


### DELETE /:id endpoint

```
exports.delete_detail = async (ctx: any, next: any) => {

  const id = ctx.params.id;   // this is the params ID

  ctx.body = {
    method: 'DELETE'
    paramsId: id;
  }
)
```




