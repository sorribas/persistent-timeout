var lt = require('long-timeout');
var crypto = require('crypto');
var events = require('events');

module.exports = function (db, listener, opts) {
  var stream = db.createReadStream()
  var streamEnded = false;
  var that = new events.EventEmitter();

  stream.on('data', ondata);
  stream.on('end', function () {
    streamEnded = true;
  });
  stream.on('error', function (err) {
    that.emit('error', err)
  });

  that.timeout = function (timestamp, data, cb) {
    cb = cb || function () {};
    var key = timestamp + '-' + hash(data);
    var val = {timestamp: timestamp, data: data};

    endOfStream(function () {
      lt.setTimeout(function () {
        db.del(key);
        listener(data, timestamp);
      }, timestamp - Date.now());
      db.put(key, val, cb);
    });
  };

  return that;

  function ondata (record) {
    lt.setTimeout(function () {
      db.del(record.key);
      listener(record.value.data, record.value.timestamp);
    }, record.value.timestamp - Date.now());
  }

  function endOfStream (cb) {
    if (streamEnded) return cb();
    stream.on('end', cb);
  }
};

function hash (obj) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}
