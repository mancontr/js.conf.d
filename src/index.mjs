import fs from 'node:fs'
import path from 'node:path'

function getEnabledFiles (folders, sort) {
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

function mergeConfigs(configs, merge) {
  return configs.reduce((acc, curr) => merge(acc, curr), {})
}

async function getConfig(folders, opts) {
  const { merge = Object.assign, sort } = opts || {}

  const files = getEnabledFiles(folders, sort)
  const configs = await Promise.all(
    files.map((file) => import(file).then((module) => module.default || module))
  )

  const normalizedConfigs = configs.map(config => ({
    ...config
  }))

  return mergeConfigs(normalizedConfigs, merge)
}

getConfig.getEnabledFiles = getEnabledFiles
getConfig.mergeConfigs = mergeConfigs

export default getConfig