const mkdirp = require('mkdirp')
const _ = require('lodash')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const build = (core) => {
  const tmpI18nPath = path.join(process.cwd(), 'generated/i18n')
  const translationKeys = getTranslationKey()
  const messages = {}

  // create directory
  mkdirp('-p', tmpI18nPath)

  for (const locale of getLocales()) {
    // map translation keys found in vue templates and generate actual translation files, one for each locale
    const translationFilePaths = glob.sync(`**/${locale}.all.yaml`, { cwd: path.join(process.cwd(), '../translations/merged') })
    const translations = getTranslationsFromPaths(translationFilePaths)

    const vueTranslations = {}
    for (const key of translationKeys) {
      if (translations[key]) {
        let transValue = translations[key].other
        transValue = transValue.split('{{.').join('{')
        transValue = transValue.split('}}').join('}')
        vueTranslations[key] = transValue
      }
    }

    messages[locale] = vueTranslations
  }

  // generate import files, one for each locale
  fs.writeFileSync(`${tmpI18nPath}/messages.json`, JSON.stringify(messages), { encoding: 'utf8' })
}

// parse all vue template files for translation keys
function getTranslationKey () {
  let translationKeys = []
  const templateFiles = glob.sync('**/src/**/*.{pug,vue}')
  for (const file of templateFiles) {
    const fileContent = fs.readFileSync(file, 'utf8')
    const query = /\$t\((['][^']*[']|["][^"]*["]|[`][^`]*[`])/g // searching for usage of $t method
    translationKeys = translationKeys.concat(fileContent.match(query) || [])
  }

  return _.uniq(translationKeys.map(key => key.slice(4, key.length - 1)))
}

// get all available locales
function getLocales () {
  return _.uniq(glob.sync('**/*.all.yaml', { cwd: path.join(process.cwd(), '../translations/merged') }).map(filename => {
    return path.basename(filename, '.all.yaml')
  }))
}

function getTranslationsFromPaths (translationFilePaths) {
  let translations = {}
  for (const translationFilePath of translationFilePaths) {
    const translationObj = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), '../translations/merged', translationFilePath), 'utf8'))
    translations = Object.assign(translations, translationObj)
  }
  return translations
}

module.exports = {build}
