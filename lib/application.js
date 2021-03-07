const mm = require('micromatch')
const walkDir = require('./walkDir')
const render = require('./renderWithMustache')

const app = {
  run({
    baseDirectory,
    command,
    matchers,
  }) {
    const matches = []
    walkDir(baseDirectory, filePath => {
      if (mm.isMatch(filePath, matchers)) {
        matches.push(filePath)
      }
    })
    console.log(matches.map(match => render(command, { file: match })))
  }
}

class Application {
  constructor() {
    Object.assign(this, app)
  }
}

module.exports = Application
