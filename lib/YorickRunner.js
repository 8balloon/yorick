const mm = require('micromatch')
const walkDir = require('./utils/walkDir')
const render = require('./utils/renderWithMustache')

module.exports.YorickRunner = (runnerConfig) => {
  function run({
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

  return { run }
}
