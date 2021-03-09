const path = require('path')
const itis = require('./lib/itis')
const configOptions = require('./configOptions')

const optionator = require('optionator')({
  prepend: 'Usage: yorick [options]',
  append: `Version ${require('../package.json').version}`,
  options: [...configOptions.globalOptions, ...configOptions.suiteOptions],
})

module.exports = async function createRunnerConfig(processCwd, argv) {
  const options = optionator.parseArgv(argv)
  if (options.help) {
    console.log(optionator.generateHelp())
    return
  }
  
  let fileConfig = {}
  const configFilePath = path.resolve(options.context || processCwd, 'yorick.config.js')
  if (fs.existsSync(configFilePath)) {
    let getConfig = require(configFilePath)
    if (itis.Object(getConfig)) {
      getConfig = () => getConfig
    }
    fileConfig = await getConfig()
  }

  let suites = []
  if (fileConfig.suites) {
    if (configOptions.suiteOptions.some(o => options[o.option])) {
      const globalOptionsStr = globalOptions.map(o => `--${o.option}`).join(', ')
      throw new Error(`when "suites" used in yorick.config.js, only global CLI options are allowed (${globalOptionsStr})`)
    }
    suites = fileConfig.suites
  } else {
    const missingOption = configOptions.requiredSuiteOptions.find(o => !options[o.option])
    if (missingOption) {
      const optionStr = missingOption.option
      throw new Error(`missing option "${optionStr}". Either specify via "--${optionStr}" or include in yorick.config.js "suites" array object`)
    }
    suites = {}
    configOptions.requiredSuiteOptions.forEach(o => {
      suites[o.option] = options[o.option]
    })
  }

  const config = {
    context: options.context || fileConfig.context || processCwd,
    suites,
  }
  
  return config
}
