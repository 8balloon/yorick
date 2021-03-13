const cp = require('child_process')
const mm = require('micromatch')
const walkDir = require('./utils/walkDir')
const render = require('./utils/renderWithMustache')
const dockerUtils = require('./utils/dockerUtils')

module.exports.YorickRunner = (runnerConfig) => {
  async function run() {

    console.log(JSON.stringify({ runnerConfig }, null, 2))
    
    try {
      // node cli --run "echo hello world" --match "**/**" --dockerfile yorick.test.Dockerfile

      const random = Math.random().toString().slice(7)
      const imageName = `yorick-image:${random}`
      const containerName = `yorick-container-${random}`

      // TODO: use context (directly if its absolute, resolved with process.cwd otherwise) via child_process "cwd"
      // TODO: define cpus
      // TODO: stream results of these isntead of waiting until they're all complete
      const startTime = Date.now()
      console.log("BUILDING!", `docker build --tag=${imageName} -f ${runnerConfig.dockerfile} .`)
      let buildResult = ''
      await dockerUtils.build({
        cwd: runnerConfig.context,
        imageName,
        dockerfile: runnerConfig.dockerfile,
        onData: data => process.stdout.write(data), // console.log without the newline
      })
      console.log("BUILT!")
      console.log({ buildResult })
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
      const deleteResult = cp.execSync(`docker rmi ${imageName}`).toString()
      console.log("REMOVED IMAGE!")
      console.log({ deleteResult })
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

    // if (error.errno === -13) ... (permissino error -- their docker might not be set up correctly https://docs.docker.com/engine/install/linux-postinstall/)
  }

  return { run }
}
