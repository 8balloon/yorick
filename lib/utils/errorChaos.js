const options = {
  innerCtxLimit: 4,
  outerCtxLimit: 3,
  onProcessError: logProcessError,
}

const errorToCtx = new WeakMap()

function hasNoCruft(line) {
  return (
    line.startsWith('((') ||
    !line.includes('errorChaos') &&
    !line.includes('/node_modules') &&
    !line.includes('(internal/') &&
    /\/.*\d+/.test(line)
  )
}

function cleanStackLines(stackArray) {
  return stackArray
    .map(line => line.trim())
    .filter(line => hasNoCruft(line))
}

function getStackLines(ctx) {
  const stackLines = []
  ctx.innerCtxErrors.forEach((ctxError, idx) => {
    stackLines.push(`((ctx ${idx + 1}))`)
    ctxError.stack.split('\n').slice(1).forEach(line => stackLines.push(line))
  })
  const totalLimit = options.innerCtxLimit + options.outerCtxLimit
  if (ctx.depth > totalLimit) {
    const startSkip = options.innerCtxLimit + 1
    const endSkip = ctx.depth - options.outerCtxLimit
    const context = startSkip === endSkip ? startSkip : `${startSkip}-${endSkip}`
    stackLines.push(`((omitted: ctx ${context}))`)
  }
  ctx.outerCtxErrors.forEach((ctxError, idx) => {
    stackLines.push(`((ctx ${ctx.depth - (ctx.outerCtxErrors.length - idx - 1)}))`)
    ctxError.stack.split('\n').slice(1).forEach(line => stackLines.push(line))
  })
  return stackLines
}

function getErrorJson(error, verbose = false) {
  const ctx = errorToCtx.get(error) || {
    message: error.message,
    depth: 1,
    innerCtxErrors: [error],
    outerCtxErrors: [],
  }
  const stackLines = getStackLines(ctx)
  return {
    message: ctx.message,
    stack: verbose ? stackLines : cleanStackLines(stackLines)
  }
}

const initiator = '\n((begin synthetic trace))\n'
const terminator = '\n((end synthetic trace))\n'

function removeSyntheticTrace(message) {
  const [ mainBody ] = message.split(initiator)
  const splitByTerminator = message.split(terminator)
  const appendice = splitByTerminator.length > 1 ? splitByTerminator.pop() : ''
  return mainBody + appendice
}

function logProcessError(error, prefix) {
  const { message, stack } = getErrorJson(error)
  console.error(prefix, JSON.stringify({
    message,
    stack,
  }, null, 2))
}

let initialized = false
function initialize(_options) {
  if (initialized) return
  initialized = true
  Object.assign(options, _options)
  
  const NativePromise = Promise
  Promise = function Promise(cb) {
    const ctxError = new Error()
    return new NativePromise((nativeResolve, nativeReject) => {
      cb(nativeResolve, function syntheticReject(error) {
        const ctx = errorToCtx.get(error) || {
          message: error.message,
          depth: 0,
          innerCtxErrors: [],
          outerCtxErrors: [],
        }
        errorToCtx.set(error, ctx)
        
        ctx.depth++
        if (ctx.innerCtxErrors.length < options.innerCtxLimit) {
          ctx.innerCtxErrors.push(ctxError)
        }
        else {
          ctx.outerCtxErrors.push(ctxError)
          if (ctx.outerCtxErrors.length > options.outerCtxLimit) {
            ctx.outerCtxErrors.shift()
          }
        }
        
        Object.defineProperty(error, 'message', {
          get() {
            const stackLines = getStackLines(ctx)
            return ctx.message + initiator + cleanStackLines(stackLines).join('\n') + terminator
          },
          set(newMessage) {
            ctx.message = removeSyntheticTrace(newMessage)
          },
        })
        
        nativeReject(error)
      })
    })
  }
  Promise.prototype = NativePromise.prototype
  
  Promise.all = NativePromise.all
  Promise.allSettled = NativePromise.allSettled
  Promise.race = NativePromise.race
  Promise.reject = NativePromise.reject
  Promise.resolve = NativePromise.resolve

  if (typeof process !== 'undefined') {
    process.on('unhandledRejection', error => {
      options.onProcessError(error, 'unhandledRejection')
    })
    process.on('uncaughtException', error => {
      options.onProcessError(error, 'uncaughtException')
    })
  }
}

module.exports = {
  getErrorJson,
  initialize,
  logProcessError,
}

if (typeof process !== 'undefined' && process.env.ECDB) {
  initialize()
}
