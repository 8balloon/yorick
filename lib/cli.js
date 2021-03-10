const base64 = require('./utils/base64')

async function main() {
  if (process.env.YORICK_RUNNEE_CONFIG) {
    if (process.argv.slice(2).length) {
      throw new Error('yorick does not accept arguments when invoked inside of a docker container; please configure yorick using yorick.config.js or command-line flags (outside of the docker container)')
    }
    const { YorickRunnee } = require('./YorickRunnee')
    const runneeConfig = JSON.parse(base64.decode(process.env.YORICK_RUNNEE_CONFIG))
    const runnee = new YorickRunnee(runneeConfig)
    runnee.run()
  } else {
    const { YorickRunner } = require('./YorickRunner')
    const { RunnerConfig } = require('./RunnerConfig')
    const runnerConfig = await RunnerConfig(process.cwd(), process.argv)
    const runner = new YorickRunner(runnerConfig)
    runner.run()
  }
}

main()
