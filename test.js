var test = require('tape');
var memdb = require('memdb');
var persistentTimeout = require('./');

test('basic', function (t) {
  var db = memdb({valueEncoding: 'json'});
  var pt = persistentTimeout(db, cb);

  pt.timeout(Date.now() + 2500, {name: 'ed'});

  function cb (data, ts) {
    t.equal(data.name, 'ed');
    t.equal(Math.floor(ts / 1000), Math.floor(Date.now() / 1000));
    t.end();
  }
});

test('existing timeout', function (t) {
  var db = memdb({valueEncoding: 'json'});
  var pt = persistentTimeout(db, cb);
  var timestamp = Date.now() + 2500;

  db.put(`${timestamp}-0015dbab4b29c384d557ee74f91a21132d7ac6f4576f800f6e3ed0f642cec761`, {timestamp: timestamp, data: {name: 'ed'}}, onput);

  function onput (err) {
    t.notOk(err);
  }

  function cb (data) {
    t.equal(data.name, 'ed');
    t.end();
  }
});

test('remove timeout', function (t) {
  var db = memdb({valueEncoding: 'json'});
  var pt = persistentTimeout(db, cb);

  var key = pt.timeout(Date.now() + 2500, {name: 'ed'});
  setTimeout(function () {
    pt.removeTimeout(key);
  }, 500);

  setTimeout(function () {
    t.end();
  }, 4000);

  function cb (data, ts) {
    t.fail('Should not be called');
  }
})
