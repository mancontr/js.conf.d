const fs = require('fs')
const path = require('path')

module.exports = function (folders) {
  const filesMap = {}

  // Track all files from each folder, replacing the repeated names from previous folders
  for (const folder of folders) {
    const fullFolder = path.join(process.cwd(), folder)
    const files = fs.readdirSync(fullFolder)
    for (const fileName of files) {
      const fullPath = path.join(fullFolder, fileName)
      filesMap[fileName] = fullPath
    }
  }

  // Load the correct version of each file, in filename order
  const ret = {}
  const files = Object.keys(filesMap)
  files.sort()
  for (const file of files) {
    const content = require(filesMap[file])
    Object.assign(ret, content)
  }
  return ret
}
