const path = require('path')
const fs = require('fs')

const tmpFileName = Math.random().toString().slice(2)

const getStdDockerfilePath = context => path.resolve(context, 'Dockerfile')
const getTmpFilePath = context => path.resolve(context, `Dockerfile.${tmpFileName}.bkp`)
const getYorickPath = (context, dockerfile) => path.resolve(context, dockerfile)
const getPaths = (context, dockerfile) => {
  const stdPath = getStdDockerfilePath(context)
  const tmpPath = getTmpFilePath(context)
  const yorickPath = getYorickPath(context, dockerfile)
  return { stdPath, tmpPath, yorickPath }
}

function jimmyFiles(context, dockerfile) {
  if (dockerfile === 'Dockerfile') return
  const { stdPath, tmpPath, yorickPath } = getPaths(context, dockerfile)
  if (!fs.existsSync(yorickPath)) {
    throw new Error(`yorick dockerfile at ${yorickPath} does not exist`)
  }
  if (fs.existsSync(stdPath)) {
    fs.renameSync(stdPath, tmpPath)
  }
  fs.renameSync(yorickPath, stdPath)
}
function unjimmyFiles(context, dockerfile) {
  if (dockerfile === 'Dockerfile') return
  const { stdPath, tmpPath, yorickPath } = getPaths(context, dockerfile)
  fs.renameSync(stdPath, yorickPath)
  if (fs.existsSync(tmpPath)) {
    fs.renameSync(tmpPath, stdPath)
  }
}

module.exports = {
  jimmyFiles,
  unjimmyFiles,
}
