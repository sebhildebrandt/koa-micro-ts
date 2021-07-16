# API Doc

`koa-micro-ts` comes with an integrated (optional) API doc feature. For all annoteted routes catched by `autoroute` (as well as `readyness` and `liveness` ) an API documentation wil be generated as soon as you enable it BEFORE any `app.autoroute`. You also provide the enpoint URL where the documentation should be reachable. Here a small example:

## Set up API DOC
```
app.apiDoc = '/api/doc';

app.autoRoute(path.join(__dirname, 'controllers/api/v1'), '/api/v1');
```

This generates an API documentation on endpoint `/api/doc` for all routes fount in `controlers/api/v1`.

If you want to have also `readyness` and `liveness` endpoints in your doc, be shure to initialise the two endpoints after enabling `api.apiDoc`:

```
app.apiDoc = '/api/doc';

app.health({
  livePath: `/api/live`,
  readyPath: `/api/ready`,
  name: 'Test App',
  version: '1.0'
});

app.autoRoute(path.join(__dirname, 'controllers/api/v1'), '/api/v1');
```

## Compiler Options

As APIdoc relies on comments, be sure to preserve comments while transpiling your code from TS to JS. In your `tsconfig` you should disable `removeComments`

```
{
  "compilerOptions": {
    ...
    "removeComments": false,
    ...
  }
}
```

## API Doc Reference

You can refer to the offiial API DOC reference ()[] to see how you need to provide your documentaten.

Here one small example:

```
/**
 * @api {post} /user/
 * @apiGroup User
 * @apiParam {String} [firstname]       Optional Firstname of the User.
 * @apiParam {String} lastname          Mandatory Lastname.
 * @apiParam {String} country="DE"      Mandatory with default value "DE".
 * @apiParam {Number} [age=18]          Optional Age with default 18.
 *
 * @apiParam (Login) {String} pass      Only logged in users can post this.
 *                                      In generated documentation a separate
 *                                      "Login" Block will be generated.
 *
 * @apiParam {Object} [address]         Optional nested address object.
 * @apiParam {String} [address[street]] Optional street and number.
 * @apiParam {String} [address[zip]]    Optional zip code.
 * @apiParam {String} [address[city]]   Optional city.
 *
 * @apiParamsExample Params Example:
 *     {
 *       "firstname": "John"
 *       "lastname": "Dow"
 *       "country": "US"
 *       "age": "35"
 *       "pass": "12345678"
 *       "address": {
 *           "street": "Hollywood Blvd"
 *           "zip": "90026"
 *           "city": "Los Angeles"
 *       }
 *     }
 */

exports.post = async (ctx: any, next: any) => {
  ...
};

```
