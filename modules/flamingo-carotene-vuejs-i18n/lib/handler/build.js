// https://github.com/shelljs/shelljs
const mkdirp = require('mkdirp')
const _ = require('lodash')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const build = () => {
  const tmpI18nPath = path.join(process.cwd(), 'generated/i18n')

  // i18n
  mkdirp(tmpI18nPath)

  // parse all vue template files for translation keys
  let translationKeys = []
  const templateFiles = glob.sync('**/src/**/*.{pug,vue}')

  for (const file of templateFiles) {
    const fileContent = fs.readFileSync(file, 'utf8')
    const query = /\$t\((['][^']*[']|["][^"]*["]|[`][^`]*[`])/g // searching for usage of $t method
    translationKeys = translationKeys.concat(fileContent.match(query) || [])
  }

  translationKeys = _.uniq(translationKeys.map(key => key.slice(4, key.length - 1)))
  // get all available locales
  const locales = _.uniq(glob.sync('**/*.all.yaml', { cwd: path.join(process.cwd(), '../translations/merged') }).map(filename => {
    return path.basename(filename, '.all.yaml')
  }))

  for (const locale of locales) {
    // map translation keys found in vue templates and generate actual translation files, one for each locale
    const translationFilePaths = glob.sync(`**/${locale}.all.yaml`, {
      cwd: path.join(process.cwd(), '../translations/merged')
    })
    let translations = {}

    for (const translationFilePath of translationFilePaths) {
      const translationObj = yaml.safeLoad(
        fs.readFileSync(path.join(process.cwd(), '../translations/merged', translationFilePath), 'utf8')
      )
      translations = Object.assign(translations, translationObj)
    }

    const vueTranslations = {}
    for (const key of translationKeys) {
      if (translations[key]) {
        let transValue = translations[key].other
        transValue = transValue.split('{{.').join('{').split('}}').join('}')
        vueTranslations[key] = transValue
      }
    }

    // generate import files, one for each locale
    fs.writeFileSync(
      `${tmpI18nPath}/${locale}.js`, [
        '/* this file is generated via the carotene-cli buildAssets task */',
        `import i18n from 'i18n'`,
        `const translations = ${JSON.stringify(vueTranslations)}`,
        `i18n.setLocaleMessage('default', translations)\n`,
      ].join('\n'),
      { encoding: 'utf8' },
    )
  }
}

const entries = () => {
  (function () {
    // get all available locales
    const locales = glob.sync('**/*.js', {
      cwd: path.join(process.cwd(), 'generated/i18n'),
    }).map(filename => {
      return path.basename(filename, '.js')
    })

    const entry = {}
    for (const locale of locales) {
      entry[`i18n_${locale}`] = path.join(config.paths.generated, 'i18n', `${locale}.js`)
    }
    return entry
  }())
}

module.exports = {build, entries}
