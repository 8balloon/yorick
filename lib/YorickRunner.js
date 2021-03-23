const path = require('path')
const cp = require('child_process')
const os = require('os')
const mm = require('micromatch')
const walkDir = require('./utils/walkDir')
const render = require('./utils/renderWithMustache')
const dockerUtils = require('./utils/dockerUtils')
const chunk = require('./utils/chunk')

function getContainerName(suiteName, idx) {
  return `yorick-container-${suiteName}-${idx}`
}

module.exports.YorickRunner = (runnerConfig) => {

  const containerLsOutput = cp.execSync('docker container ls')

  runnerConfig.suites.forEach(suite => {
    const containerName = getContainerName(suite.name, 0)
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
      const { name, dockerfile, runCommand, fileParamMatch, fileParamIgnore } = suite
      const startTime = Date.now()

      const fileParamMatches = []
      walkDir(process.cwd(), filePath => {
        if (mm.isMatch(filePath, fileParamMatch)) {
          if (!mm.isMatch(filePath, fileParamIgnore)) {
            fileParamMatches.push(path.relative(process.cwd(), filePath))
          }
        }
      })
      console.log({ fileParamMatches })

      const allCommands = fileParamMatches.map(match => render(runCommand, { file: match }))

      let runnerCount = os.cpus().length - 1
      if (runnerCount > allCommands.length) runnerCount = allCommands.length

      console.log({ allCommands, runnerCount })
      
      const imageName = `yorick-image:${name}`
      await dockerUtils.build({ imageName, dockerfile, onData: data => process.stdout.write(data) })
      
      const chunks = chunk(allCommands, runnerCount)

      console.log({ chunks })

      await Promise.all(chunks.map(async (chunkCommands, idx) => {

        const containerName = getContainerName(name, idx)
        await dockerUtils.run({ containerName, imageName, onData: data => {
          // console.log('got data he2221', data.toString())
          // process.stdout.write(data)
        }})
  
        for (const command of chunkCommands) {
          await dockerUtils.exec({
            containerName,
            // args: ['yarn', 'jest'],
            args: command.split(' '),
            onData: data => {
              console.log("got data:", data.toString())
              process.stdout.write(data)
            },
          })
        }
        await dockerUtils.stop({ containerName, onData: () => {} })
        await dockerUtils.remove({ containerName, onData: () => {} })
      }))


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
  }

  return { run }
}
