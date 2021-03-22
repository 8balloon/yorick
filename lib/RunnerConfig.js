const path = require('path')
const fs = require('fs')
const itis = require('./utils/itis')
const configOptions = require('./configOptions')

const optionator = require('optionator')({
  prepend: 'Usage: yorick [options]',
  append: `Version ${require('../package.json').version}`,
  options: configOptions,
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

async function RunnerConfig(argv) {
  const options = optionator.parseArgv(argv)
  if (options.help) {
    console.log(optionator.generateHelp())
    return
  }
  
  const configFilePath = path.resolve(process.cwd(), options.config || 'yorick.config.js')
  const configGetter = RunnerConfig.getConfigGetter(configFilePath)

  const config = await configGetter()

  configOptions.forEach(co => {
    if (options[co.option] !== undefined) {
      config[co.option] = options[co.option]
    }
  })
  delete config['help']
  delete config['config']

  if (!(config.suites || []).length) {
    throw Error('missing "suites" field in yorick.config.js output')
  }
  config.suites.forEach(suite => {
    suite.dockerfile = suite.dockerfile || 'yorick.Dockerfile'
  })

  return config
}

module.exports.RunnerConfig = RunnerConfig
