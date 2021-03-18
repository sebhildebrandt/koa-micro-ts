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

### GET endpoint

#### Using query parameters

### GET /:id endpoint
Resource detail endpoint

### PUT endpoint

### PUT /:id endpoint

### POST endpoint

### POST /:id endpoint

### DELETE endpoint

### DELETE /:id endpoint


