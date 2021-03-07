const Application = require('../lib/application')

const app = new Application()

app.run({
  baseDirectory: process.cwd(),
  command: 'node {{file}}',
  matchers: ['**/*testFile*'],
})
