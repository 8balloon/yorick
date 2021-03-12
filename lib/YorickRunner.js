const path = require('path')
const fs = require('fs')
const cp = require('child_process')
const Docker = require('dockerode')
const mm = require('micromatch')
const walkDir = require('./utils/walkDir')
const render = require('./utils/renderWithMustache')
const { jimmyFiles, unjimmyFiles } = require('./utils/fileJimmying')

function getDockerodeConfig(dockerConfig) {
  const dConfig = {}
  ;['host', 'port', 'ca', 'cert', 'key', 'version'].forEach(key => {
    if (dockerConfig[key]) dConfig[key] = dockerConfig[key]
  })
  return dConfig
}

function getDockerodeSrcFiles(runnerConfig) {const files = []
  walkDir(runnerConfig.context, filePath => {
    let relPath = filePath.split(runnerConfig.context)[1]
    if (relPath[0] === '/') {
      relPath = relPath.split('/')[1]
    }
    if (relPath !== 'Dockerfile' && relPath !== runnerConfig.dockerfile) {
      files.push(relPath)
    }
  })
  files.push('Dockerfile')
  return files
}

module.exports.YorickRunner = (runnerConfig) => {
  async function run() {

    console.log(JSON.stringify({ runnerConfig }, null, 2))

    const files = getDockerodeSrcFiles(runnerConfig)
    
    try {

      const docker = new Docker(getDockerodeConfig(runnerConfig.docker))

      const random = Math.random().toString().slice(2)
      const imageTag = `yorick:${random}`

      jimmyFiles(runnerConfig.context, runnerConfig.dockerfile)
      try {
        const stream = await docker.buildImage({
          context: runnerConfig.context,
          src: files,
        }, { t: imageTag })
        await new Promise((resolve, reject) => {
          docker.modem.followProgress(stream, (err, res) => {
            err ? reject(err) : resolve(res)
            console.log(JSON.stringify(res, null, 2))
          })
        })
      } catch (error) {
        throw error
      } finally {
        unjimmyFiles(runnerConfig.context, runnerConfig.dockerfile)
      }

      docker.run(imageTag, ['echo', 'yolo'], process.stdout).then(function(data) {
        var output = data[0];
        var container = data[1];
        console.log(output.StatusCode);
        return container.remove();
      }).then(function(data) {
        console.log('container removed');
      }).catch(function(err) {
        console.log(err);
      });


      // node cli --run "echo hello world" --match "**/**" --dockerfile yorick.test.Dockerfile
      /*
      const image = docker.getImage()


      const dockerfile = path.resolve(runnerConfig.context, runnerConfig.dockerfile)
      
      const command = `docker build --file ${dockerfile} --tag ${imageTag} ${runnerConfig.context}`
      console.log(JSON.stringify({ command }, null, 2))
      const result = cp.execSync(command).toString()
      console.log(JSON.stringify({ result }, null, 2))
      const deleteResult = cp.execSync(`docker image rm ${tag}`).toString()
      console.log(JSON.stringify({ deleteResult }))
      */
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
