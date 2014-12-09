var test = require('tape')

var vibrant = require('../')

test('does all the right things', function(t) {
  t.plan(6)

  var vibrantStream = vibrant(1, checkArgs, fakeTimer)
    , count = 1

  vibrantStream.write([1, 1])

  function checkArgs(arg) {
    if(count === 1) {
      t.deepEqual(arg, [1, 1])
      vibrantStream.write([2, 2])
    }

    if(count === 2) {
      t.deepEqual(arg, [2, 2])
      vibrantStream.write(3)
    }

    if(count === 3) {
      t.strictEqual(arg, 3)
    }

    ++count
  }

  function fakeTimer(fn, time) {
    if(count === 2) t.strictEqual(time, 2)
    if(count === 3) t.strictEqual(time, 4)
    if(count === 4) t.strictEqual(time, 4)

    fn()
  }
})
