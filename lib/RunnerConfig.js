const path = require('path')
const fs = require('fs')
const itis = require('./utils/itis')
const configOptions = require('./configOptions')

const optionator = require('optionator')({
  prepend: 'Usage: yorick [options]',
  append: `Version ${require('../package.json').version}`,
  options: [...configOptions.globalOptions, ...configOptions.suiteOptions],
})

RunnerConfig.getConfigGetter = (configFilePath) => {
  let getConfig = () => ({})
  if (fs.existsSync(configFilePath)) {
    getConfig = require(configFilePath)
    if (itis.Object(getConfig)) {
      getConfig = () => getConfig
    }
  }
  return getConfig
}

async function RunnerConfig(processCwd, argv) {
  const options = optionator.parseArgv(argv)
  if (options.help) {
    console.log(optionator.generateHelp())
    return
  }
  
  const configFilePath = path.resolve(options.context || processCwd, 'yorick.config.js')
  const configGetter = RunnerConfig.getConfigGetter(configFilePath)
  const fileConfig = await configGetter()

  let suites
  if (fileConfig.suites) {
    if (configOptions.suiteOptions.some(o => options[o.option])) {
      const globalOptionsStr = globalOptions.map(o => `--${o.option}`).join(', ')
      throw new Error(`when "suites" used in yorick.config.js, only global CLI options are allowed (${globalOptionsStr})`)
    }
    suites = fileConfig.suites
  } else {
    const suite = {}
    configOptions.requiredSuiteOptions.forEach(o => {
      suite[o.option] = options[o.option]
    })
    suites = [suite]
  }
  suites.forEach(suite => {
    const missingOptions = configOptions.requiredSuiteOptions.filter(o => !suite[o.option])
    if (missingOptions.length) {
      const optionStr = missingOptions.map(o => `"${o.option}"`).join(', ')
      throw new Error(`missing option(s): ${optionStr}. Either specify via "--${missingOptions[0].option}" or include in every yorick.config.js "suites" array object`)
    }
  })

  return {
    context: options.context || fileConfig.context || processCwd,
    suites,
  }
}

module.exports.RunnerConfig = RunnerConfig
