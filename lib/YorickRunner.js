const mm = require('micromatch')
const walkDir = require('./utils/walkDir')
const render = require('./utils/renderWithMustache')

module.exports.YorickRunner = (runnerConfig) => {
  function run() {
    console.log(JSON.stringify({ runnerConfig }, null, 2))
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
