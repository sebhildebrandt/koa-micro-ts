# Auto-Routes

Directory based routing is one of the smart features of this package:

`autoRoute` allows you to just write your API endpoints and place them into a
directory structure. When calling `app.autoRoute(...directory..., mountpoint)`,
this directory will be parsed recursivly and all TypeScript files with extension
`.route.ts` are added as routes. All routes then will be mounted to the given
`mountpoint`. Your API structure then matches exactly your directory structure.
This makes writing and maintaining your API endpoints super simple.

Adding additional files in your routes directory will now automatically create
API endpoints without having to manage an additional routes file.

```
DIRECTORY-STRUCTURE                      will lead to                API-STRUCTURE

./routes                                                             /api/v1
  ├─ users                                                              ├─ /users     (get)
  │    └─ index.route.ts                                                ├─ /users/:id (get/:id)
  │       (containing get, get/:id, post, push/:id and delete/:id)      ├─ /users     (post)
  │                                                                     ├─ /users/:id (push)
  │                                                                     ├─ /users/:id (delete)
  ├─ warehouse                                                          ├─ /warehouse
  │    ├─ orders                                                        │    │
  │    │    └─ index.route.ts                                           │    ├─ /orders ...
  │    └─ products                                                      │    │
  │    │    └─ index.route.ts                                           │    └─ /products ...
  │                                                                     │
  └─ customers                                                          │
       └─ index.route.ts                                                └─ /customers ...
```

Mount all routes with this on-liner: since version 4.0 this is an async
function:

```
async app.autoRoute(path.join(__dirname, '/routes'), '/api/v1');
```

But how to set up the different methods (GET, PUT, DELETE, POST) and handle
query params and body data? In the following chapter you see all examples:

## Examples

First, make sure, that you place your routes inside a dedicated directory e.g.
`./routes` or `./controllers`

For each resource you may have a separate subdirectory (e.g. users, customers,
orders, ...). Inside this directory just create a `index.route.ts` file.

In all examples, we are returning a JSON object, describing the method and is
available query or body params:

### GET endpoint

Creating a simple GET route is simple:

```
exports.index = async (ctx: any, next: any) => {

  // just return, what your GET method should return ;-)
  ctx.body = {
    method: 'GET',
    message: 'simple get route - koa-micro-ts',
  }
}
```

#### Using query parameters

All query parameters are available in `ctx.query`. This get route would just
return the get query parameters back to the client:

```
exports.index = async (ctx: any, next: any) => {
  ctx.body = {
    method: 'GET',
    query: ctx.query
  }
}
```

### GET /:id endpoint

Resource detail endpoint

Instead of exporting an async `index` function, you just export a `detail`
function. Inside this function you can easily access the `id` parameter in
`ctx.params.id`:

```
exports.detail = async (ctx: any, next: any) => {
  const id = ctx.params.id;   // this is the params ID

  ctx.body = {
    method: 'GET',
    paramsId: id;
  }
}
```

if you need somthing like `GET /:id/:id` you can just create a function line
this:

```
exports.detail_detail = async (ctx: any, next: any) => {
  const id = ctx.params.id;   // this is the params ID
  const id2 = ctx.params.id2;   // this is the second params ID

  ctx.body = {
    method: 'GET',
    paramsId: id,
    paramsId2: id2
  }
}
```

You of course can do it the same for `put`, `post`, and `delete` methods and
this works up to three levels `/:id/:/id2/:id3`

### PUT endpoint

All other methods are as simple as GET endpoints. Just export an async function
with the proper function name matching the method: PUT and POST will also allow
accessing the alrealy parsed body in `ctx.request.body`

```
exports.put = async (ctx: any, next: any) => {

  const bodyData = ctx.request.body;    // this is your body data

  ctx.body = {
    method: 'PUT',
    bodyData: bodyData
  }
}
```

### PUT /:id endpoint

```
exports.put_detail = async (ctx: any, next: any) => {

  const id = ctx.params.id;   // this is the params ID
  const bodyData = ctx.request.body;    // this is your body data

  ctx.body = {
    method: 'PUT',
    paramsId: id,
    bodyData: bodyData
  }
}
```

### POST endpoint

```
exports.post = async (ctx: any, next: any) => {

  const bodyData = ctx.request.body;    // this is your body data

  ctx.body = {
    method: 'POST',
    bodyData: bodyData
  }
}
```

### POST /:id endpoint

```
exports.post_detail = async (ctx: any, next: any) => {

  const id = ctx.params.id;   // this is the params ID
  const bodyData = ctx.request.body;    // this is your body data

  ctx.body = {
    method: 'POST',
    paramsId: id,
    bodyData: bodyData
  }
}
```

### DELETE endpoint

```
exports.delete = async (ctx: any, next: any) => {

  ctx.body = {
    method: 'DELETE'
  }
}
```

### DELETE /:id endpoint

```
exports.delete_detail = async (ctx: any, next: any) => {

  const id = ctx.params.id;   // this is the params ID

  ctx.body = {
    method: 'DELETE',
    paramsId: id
  }
)
```
