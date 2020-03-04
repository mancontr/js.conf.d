const fs = require('fs')
const path = require('path')

const getEnabledFiles = (folders, sort) => {
  // Create a list of all files from each folder,
  // replacing repeated filenames from previous folders
  const filesMap = {}
  for (const folder of folders) {
    const fullFolder = path.resolve(process.cwd(), folder)
    if (!fs.existsSync(fullFolder)) continue
    const files = fs.readdirSync(fullFolder)
    for (const fileName of files) {
      if (fileName[0] === '.') continue // Skip hidden files
      const fullPath = path.resolve(fullFolder, fileName)
      const stat = fs.lstatSync(fullPath)
      if (stat.isFile()) {
        filesMap[fileName] = fullPath
      }
    }
  }

  // Sort the filenames, and return the full paths of each file
  const files = Object.keys(filesMap)
  files.sort(sort)
  return files.map(file => filesMap[file])
}

const mergeConfigs = (configs, merge) =>
  configs.reduce((acc, curr) => merge(acc, curr), {})

const getConfig = (folders, opts) => {
  const { merge = Object.assign, sort } = opts || {}

  const files = getEnabledFiles(folders, sort)
  const configs = files.map(file => require(file))
  return mergeConfigs(configs, merge)
}

getConfig.getEnabledFiles = getEnabledFiles
getConfig.mergeConfigs = mergeConfigs

module.exports = getConfig
