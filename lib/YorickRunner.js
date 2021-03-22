const cp = require('child_process')
const os = require('os')
const mm = require('micromatch')
const walkDir = require('./utils/walkDir')
const render = require('./utils/renderWithMustache')
const dockerUtils = require('./utils/dockerUtils')

function getContainerName(suiteName) {
  return `yorick-container-${suiteName}`
}

module.exports.YorickRunner = (runnerConfig) => {

  const containerLsOutput = cp.execSync('docker container ls')

  runnerConfig.suites.forEach(suite => {
    const containerName = getContainerName(suite.name)
    if (containerLsOutput.includes(containerName)) {
      throw Error(`suite "${suite.name}" is already being run (container name: ${containerName})`)
    }
  })

  async function run(suite = null) {

    if (!suite) {
      for (const suite of runnerConfig.suites) {
        await run(suite)
      }
      return
    }

    console.log(JSON.stringify({ runnerConfig }, null, 2))
    
    try {
      const { name, dockerfile } = suite
      const imageName = `yorick-image:${name}`
      const containerName = getContainerName(name)
      const startTime = Date.now()

      await dockerUtils.build({ imageName, dockerfile, onData: data => process.stdout.write(data) })

      // await Promise.all(Array(os.cpus().length - 1).fill(null).map((_, idx) => {
      //   console.log({ idx })
      // }))

      await dockerUtils.run({ containerName, imageName, onData: data => process.stdout.write(data) })

      await dockerUtils.exec({
        containerName,
        args: ['echo', 'hellp worldxxxtentacion   \nstillhere!\n\nyo\n'],
        onData: data => process.stdout.write(data),
      })

      await dockerUtils.exec({
        containerName,
        args: ['yarn', 'jest'],
        onData: data => process.stdout.write(data),
      })
      const stopResult = cp.execSync(`docker stop -t 0 ${containerName}`).toString()
      console.log("STOPPED!")
      console.log({ stopResult })
      const removalResult = cp.execSync(`docker rm ${containerName}`).toString()
      console.log("RemOVED CONTAINER!")
      console.log({ removalResult })
      // const deleteResult = cp.execSync(`docker rmi ${imageName}`).toString()
      // console.log("REMOVED IMAGE!")
      // console.log({ deleteResult })
      console.log("final time (ms): ", Date.now() - startTime)

    } catch (error) {
      if (error.errno === -13) {
        console.error(`permissions error detected -- be sure you've configured your docker image correctly (for linux users: follow the instructions at https://docs.docker.com/engine/install/linux-postinstall/`)
      }
      throw error
    }

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
