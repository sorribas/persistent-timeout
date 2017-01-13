# persistent-timeout

Set timeouts that survive restarts, persisted with leveldb.

## Usage

In the example below, a timer is set 60 seconds from now. This timer will survive restarts of the script.

```js
var db = getLevelUpSomehow();
var pt = persistentTimeout(db, ontimeout);

pt.timeout(Date.now() + 60000, {foo: 'bar'}); // 60 seconds

function ontimeout (data) {
  console.log(data);
}
```

## License

MIT
