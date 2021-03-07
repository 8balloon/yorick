const Application = require('./application')

const app = new Application()

if (process.env.YORICK_CMD) {
  const config = // TODO: base64 decode and json parse the env var and pass it to app.run
} else {
  // TODO: CLI stuff
  app.run({})
}
