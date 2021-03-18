const base64 = require('./utils/base64')

async function main() {
  if (process.argv[3] === 'runnee') {
    const encodedRunneeConfig = process.argv[4]
    const { YorickRunnee } = require('./YorickRunnee')
    const runneeConfig = JSON.parse(base64.decode(encodedRunneeConfig))
    const runnee = YorickRunnee(runneeConfig)
    await runnee.run()
  } else {
    const { YorickRunner } = require('./YorickRunner')
    const { RunnerConfig } = require('./RunnerConfig')
    const runnerConfig = await RunnerConfig(process.argv)
    const runner = YorickRunner(runnerConfig)
    await runner.run()
  }
}

main()
