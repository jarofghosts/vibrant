var through = require('through')

module.exports = vibrant

function vibrant(_delay, _vibrate, _timeout) {
  var timeout = _timeout || settimeout
    , delay = _delay || 0

  var running = false
    , isDone = false
    , queue = []
    , wait = 0
    , vibrate
    , next

  if(typeof window !== 'undefined' && window.navigator) {
    vibrate = window.navigator.vibrate || window.navigator.mozVibrate
    vibrate = vibrate.bind(window.navigator)
  }

  vibrate = _vibrate || vibrate

  var vibrantStream = through(doVibrate, done)

  return vibrantStream

  function doVibrate(data) {
    queue.push(data)
    vibrantStream.queue(data)

    if(!running) doNext()
  }

  function doNext() {
    if(!queue.length) {
      running = false

      return isDone ? done() : null
    }

    next = queue.shift()
    running = true

    if(Array.isArray(next)) {
      wait = next.reduce(sum)
    } else {
      wait = next + delay
      next = +next
    }

    vibrate(next)

    timeout(doNext, wait)
  }

  function done() {
    if(!running && !queue.length) return vibrantStream.queue(null)
    isDone = true
  }
}

function sum(a, b) {
  return +a + +b
}

function settimeout() {
  return setTimeout.apply(null, arguments)
}
