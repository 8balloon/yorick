const mm = require('micromatch')
const walkDir = require('./utils/walkDir')
const render = require('./utils/renderWithMustache')

const runner = {
  run({
    baseDirectory,
    command,
    matchers,
  }) {
    console.log(process.env.YORICK_CMD)
    // const matches = []
    // walkDir(baseDirectory, filePath => {
    //   if (mm.isMatch(filePath, matchers)) {
    //     matches.push(filePath)
    //   }
    // })
    // console.log(matches.map(match => render(command, { file: match })))
  }
}

class Application {
  constructor(runnerConfig) {
    Object.assign(this, { runnerConfig }, runner)
  }
}

module.exports = Application
