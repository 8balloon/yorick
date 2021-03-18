const cp = require('child_process')
const os = require('os')
const mm = require('micromatch')
const walkDir = require('./utils/walkDir')
const render = require('./utils/renderWithMustache')
const dockerUtils = require('./utils/dockerUtils')

module.exports.YorickRunner = (runnerConfig) => {
  async function run(suite = null) {

    if (!suite) {
      for (const suite of runnerConfig.suites) {
        await run(suite)
      }
      return
    }

    console.log(JSON.stringify({ runnerConfig }, null, 2))
    
    try {
      const { name } = suite
      const imageName = `yorick-image:${name}`
      const containerName = `yorick-container-${name}`

      const startTime = Date.now()
      console.log("BUILDING!", `docker build --tag=${imageName} -f ${suite.dockerfile} .`)
      let buildResult = ''
      await dockerUtils.build({
        imageName,
        dockerfile: suite.dockerfile,
        onData: data => process.stdout.write(data), // console.log without the newline
      })
      console.log("BUILT!")
      console.log({ buildResult })

      await Promise.all(Array(os.cpus() - 1).fill(null).map((_, idx) => {

      }))

      const runResult = cp.execSync(`docker run --name=${containerName} -td ${imageName}`).toString()
      console.log("RUNNING!")
      console.log({ runResult })
      const execResult = cp.execSync(`docker exec ${containerName} echo hello world!42458`).toString()
      console.log("EXECD 1!")
      console.log({ execResult })
      const execResult2 = cp.execSync(`docker exec ${containerName} echo hello world!s econd_run`).toString()
      console.log("EXECD 2!")
      console.log({ execResult2 })
      const yarnExec = cp.execSync(`docker exec ${containerName} yarn jest`).toString()
      console.log("EXECD YARN!!!1")
      console.log({ yarnExec })
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

      // console.log({
      //   buildResult,
      //   runResult,
      //   execResult,
      //   execResult2,
      //   stopResult,
      //   removalResult,
      //   deleteResult,
      // })
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
