const path = require('path')
const fs = require('fs')

// calls callback with full file path of each file in dir
module.exports = function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? 
      walkDir(dirPath, callback)
      : callback(path.join(dir, f))
  })
}
