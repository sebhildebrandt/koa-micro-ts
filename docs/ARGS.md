# ARGS

### Getting commang line arguments

`koa-micro-ts` comes with a build in tiny argument parser. It parses all command line arguments and returns them as a JSON object:

```
app.parseArgs();
```

This will invoke parsing of command line arguments. They will be parsed as follows:

| Example Parameter | Comment | JSON result |
|---------|---------|---------|
| -v | single dash with one single character | v: true |
| --verbose | double dash with more than character | verbose: true |
| --name 'abc' | double dash with more than character followed by string | name: 'abc' |

Command line arguments are now available as a JSON object as a property of app: `app.args`

### Argument aliases

You can also provide alias names for parameters as an option object:

```
app.parseArgs({
  v: 'verbose'       // alternative arg
});
```

In this case, calling the app like

```
node ./examples/dist/example.js -v --name "This is a string"

OR

node ./examples/dist/example.js --verbose --name "This is a string"
```

will lead to the same arguments JSON object:

```
{
  verbose: true,
  name: 'This is a string'
}
```

