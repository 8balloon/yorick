const cp = require('child_process')

module.exports = {
  async build({
    cwd,
    imageName,
    dockerfile,
    onData,
  }) {
    const dockerBuild = cp.spawn('docker', ['build', `--tag=${imageName}`, '-f', dockerfile, '.'], { cwd })
    dockerBuild.stdout.on('data', data => onData(data.toString()))
    await new Promise((resolve, reject) => {
      let errorMessage = ''
      dockerBuild.stderr.on('data', data => {
        errorMessage = errorMessage + data.toString()
      })
      dockerBuild.on('error', reject)
      dockerBuild.on('exit', () => errorMessage ? reject(new Error(errorMessage)) : resolve())
    })
  },
}
