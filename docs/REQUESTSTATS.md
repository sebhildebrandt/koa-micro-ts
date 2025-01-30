# Request Stats

The following line enable request stats for your microservce:

```
app.stats();
```

### Options

As an option you can ptovide a specifiv path where the miroservice provides back
the stats object. The default path is `/stats`

So you could set options like so:

```
app.stats('/api/stats');
```
