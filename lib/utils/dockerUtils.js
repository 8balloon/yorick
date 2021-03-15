const cp = require('child_process')

async function exec({ args, cwd, onData }) {
  const dockerProcess = cp.spawn('docker', [...args], { cwd })
  dockerProcess.stdout.on('data', data => onData(data))
  await new Promise((resolve, reject) => {
    let errorMessage = ''
    dockerProcess.stderr.on('data', data => {
      errorMessage = errorMessage + data.toString()
    })
    dockerProcess.on('error', reject)
    dockerProcess.on('exit', () => errorMessage ? reject(new Error(errorMessage)) : resolve())
  })
}

module.exports = {
  async build({ cwd, imageName, dockerfile, onData }) {
    const args = ['build', `--tag=${imageName}`, '-f', dockerfile, '.']
    await exec({ args, cwd, onData })
  },
}
