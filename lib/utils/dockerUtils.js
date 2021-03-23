const cp = require('child_process')

function exec({ args, onData }) {
  const dockerProcess = cp.spawn('docker', [...args])
  dockerProcess.stdout.on('data', data => {
    onData(data)
  })
  return new Promise((resolve, reject) => {
    let errorData = ''
    dockerProcess.stderr.on('data', data => {
      onData(data) // TODO: refine
      errorData = errorData + data.toString()
    })
    dockerProcess.on('error', error => reject(error))
    dockerProcess.on('exit', code => code !== 0 ? reject(Error(errorData)) : resolve())
  })
}

module.exports = {
  async build({ imageName, dockerfile, onData }) {
    const args = ['build', `--tag=${imageName}`, '-f', dockerfile, '.']
    await exec({ args, onData })
  },
  async run({ imageName, containerName, onData }) {
    const args = ['run', `--name=${containerName}`, '-td', imageName]
    await exec({ args, onData })
  },
  async exec({ containerName, args, onData }) {
    return exec({
      args: ['exec', '--env', 'CI=true', containerName, ...args],
      onData,
    })
  },
}
