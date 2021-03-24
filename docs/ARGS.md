# ARGS

### Getting commang line arguments

`koa-micro-ts` comes with a build in tiny argument parser. It parses all command line arguments and returns them as amn JSON object.

```
const args = app.getArgs();
```

You can also provide alias names for parameters as an option object:

```
const args = app.getArgs({
  v: 'verbose'       // alternative arg
});
```

In this case, calling the app like

```
node ./examples/dist/example.js -v --name "This is a string"

OR

node ./examples/dist/example.js --verbose --name "This is a string"
```

will lead to the same args JSON object:

```
{
  verbose: true,
  name: 'This is a string'
}
```

