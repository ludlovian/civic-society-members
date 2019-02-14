'use string'

const HOP = Object.prototype.hasOwnProperty

function UNSTARTED () {}

function TRUE () {
  return true
}

const sym = typeof Symbol === 'function' ? Symbol : x => '$stream$' + x

const kValue = sym('_value')
const kReady = sym('_ready')
const kListeners = sym('_listeners')
const kParents = sym('_parents')
const kChanged = sym('_changed')
const kFunction = sym('_fn')

function isStream (s) {
  return typeof s === 'function' && kValue in s
}

function hasValue (s) {
  return s[kValue] !== UNSTARTED
}

function stream (value) {
  const s = _createStream()
  if (arguments.length > 0) s(value)
  const end = _createDependentStream([], TRUE)
  _addListener(end, s)
  s.end = end
  _addProto(s)
  return s
}

function _createStream () {
  function stream () {
    if (arguments.length !== 0) _updateStream(stream, arguments[0])
    return stream[kValue]
  }

  stream[kValue] = UNSTARTED
  stream[kReady] = false
  stream[kListeners] = []

  return stream
}

function _createDependentStream (parents, fn) {
  const s = _createStream()
  s[kParents] = parents
  s[kFunction] = fn
  s[kChanged] = []
  parents.forEach(up => _addListener(up, s))
  return s
}

function _addListener (upstream, downstream) {
  const listeners = upstream[kListeners]
  if (listeners && listeners.indexOf(downstream) === -1) {
    listeners.push(downstream)
  }
}

function _removeListener (upstream, downstream) {
  const listeners = upstream[kListeners]
  if (listeners) {
    const idx = listeners.indexOf(downstream)
    if (idx !== -1) listeners.splice(idx, 1)
  }
}

function _removeDependency (upstream, downstream) {
  const deps = downstream[kParents]
  if (deps) {
    const idx = deps.indexOf(upstream)
    if (idx !== -1) deps.splice(idx, 1)
  }
}

function _updateStream (stream, value) {
  stream[kValue] = value
  stream[kReady] = true
  if (stream[kListeners]) {
    stream[kListeners].forEach(s => {
      if (s.end === stream) {
        _endStream(s)
      } else {
        _updateListener(s, stream)
      }
    })
  }
}

function _updateListener (s, upstream) {
  const changed = s[kChanged]
  if (changed.indexOf(upstream) === -1) changed.push(upstream)
  _deriveValue(s)
}

function _deriveValue (s) {
  if (s[kReady] || s[kParents].every(up => up[kValue] !== UNSTARTED)) {
    const ret = s[kFunction](...[...s[kParents], s, s[kChanged]])
    if (ret != null) _updateStream(s, ret)
    s[kChanged] = []
  }
}

function _detachStream (stream) {
  if (stream[kParents]) {
    stream[kParents].forEach(up => _removeListener(up, stream))
    stream[kParents] = undefined
  }
  if (stream[kListeners]) {
    stream[kListeners].forEach(down => _removeDependency(stream, down))
    stream[kListeners] = undefined
  }
}

function _endStream (stream) {
  // detach from any upstream
  _detachStream(stream)
  // and ditto any end stream
  if (stream.end) {
    _detachStream(stream.end)
  }
}

function combine (fn, streams, opts = {}) {
  const s = _createDependentStream(streams, fn)
  const end = _createDependentStream(streams.map(s => s.end), TRUE)
  _addListener(end, s)
  s.end = end
  _addProto(s)
  // if requested, set as ready
  if (opts.ready) s[kReady] = true
  if (!opts.skip) {
    // set initial value
    s[kChanged] = streams.filter(s => s[kValue] !== UNSTARTED)
    _deriveValue(s)
  }
  return s
}

function merge (...streams) {
  const s = combine(
    (...args) => {
      const changed = args.pop()
      const self = args.pop()
      changed.forEach(s => self(s()))
    },
    streams,
    { ready: true, skip: false }
  )
  return s
}

function _addProto (s) {
  Object.assign(s, proto(s))
}

const proto = s => ({
  toString () {
    const v = s[kValue] === UNSTARTED ? 'UNSTARTED' : s[kValue]
    const e = s[kListeners] ? '' : ' ENDED'
    return `stream(${v}${e})`
  },

  map (fn, opts) {
    return combine(s => fn(s()), [s], opts)
  },

  on (fn, opts) {
    const m = s.map(fn, opts)
    return () => m.end()
  },

  scan (fn, acc) {
    const ns = combine(s => {
      acc = fn(acc, s())
      return acc
    }, [s])
    if (!ns[kReady]) ns(acc)
    return ns
  },

  dedupeWith (cmp) {
    let prev
    return combine((s, self) => {
      const v = s()
      if (!cmp(prev, v)) self(v)
      prev = v
    }, [s])
  },

  dedupe () {
    return s.dedupeWith(identical)
  },

  when (fn) {
    // return a stream of promises which resolve when the condition
    // is true
    let resolver
    let isResolved
    return combine((s, self) => {
      // prime the queue with an initial promise if need be
      if (!resolver) {
        self(
          new Promise(resolve => {
            resolver = resolve
          })
        )
      }
      if (fn(s())) {
        // test passes - ensure the promise is resolved
        if (!isResolved) {
          isResolved = true
          resolver()
        }
      } else {
        // test fails - put a fresh promise in the queue if needed
        if (isResolved) {
          isResolved = false
          self(
            new Promise(resolve => {
              resolver = resolve
            })
          )
        }
      }
    }, [s])
  }
})

function identical (a, b) {
  return a === b
}

function shallow (a, b) {
  return (
    a === b ||
    (a &&
      b &&
      typeof a === 'object' &&
      typeof b === 'object' &&
      Object.keys(a).every(k => a[k] === b[k]) &&
      Object.keys(b).every(k => HOP.call(a, k)))
  )
}

function deep (a, b) {
  return (
    a === b ||
    (a &&
      b &&
      typeof a === 'object' &&
      typeof b === 'object' &&
      Object.keys(b).every(k => HOP.call(a, k)) &&
      Object.keys(a).every(k => deep(a[k], b[k])))
  )
}

window.stream = stream
Object.assign(stream, { combine, merge, isStream, hasValue, shallow, deep })
export default stream
export { stream, combine, merge, isStream, hasValue, shallow, deep }
