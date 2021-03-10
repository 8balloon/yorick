const path = require('path')
const fs = require('fs')
const itis = require('./utils/itis')
const configOptions = require('./configOptions')

const optionator = require('optionator')({
  prepend: 'Usage: yorick [options]',
  append: `Version ${require('../package.json').version}`,
  options: [...configOptions.globalOptions, ...configOptions.suiteOptions],
})

RunnerConfig.getConfigFileFn = (configFilePath) => {
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
  const configFileFn = RunnerConfig.getConfigFileFn(configFilePath)
  const fileConfig = await configFileFn()

  if (fileConfig.suites && configOptions.suiteOptions.some(o => options[o.option])) {
    const suiteOptionsStr = configOptions.suiteOptions.map(o => `--${o.option}`).join(', ')
    throw new Error(`Suite options (${suiteOptionsStr}) are not allowed when "suites" is used in yorick.config.js`)
  }

  const config = fileConfig || {}
  const suites = config.suites || [{}]
  config.suites = suites

  configOptions.globalOptions.forEach(go => {
    if (options[go.option] !== undefined) {
      config[go.option] = options[go.option]
    }
  })
  config.suites.forEach(suite => {
    configOptions.suiteOptions.forEach(so => {
      if (options[so.option] !== undefined) {
        suite[so.option] = options[so.option]
      }
    })
  })
  config.context = config.context || process.cwd()
  config.dockerfile = config.dockerfile || 'yorick.Dockerfile'

  suites.forEach(suite => {
    const missingOptions = configOptions.requiredSuiteOptions.filter(o => !suite[o.option])
    if (missingOptions.length) {
      const optionStr = missingOptions.map(o => `"${o.option}"`).join(', ')
      throw new Error(`missing option(s): ${optionStr}. Either specify via "--${missingOptions[0].option}" or include in every yorick.config.js "suites" array object`)
    }
  })

  return config
}

module.exports.RunnerConfig = RunnerConfig
