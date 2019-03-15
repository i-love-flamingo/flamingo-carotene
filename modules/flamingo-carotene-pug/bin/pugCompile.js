#!/usr/bin/env node
const mkdirp = require('mkdirp-sync')
const fs = require('fs')
const path = require('path')
const pug = require('pug')

const sourcePugFilePath = process.argv[2]
const targetAstFilePath = process.argv[3]
const content = fs.readFileSync(sourcePugFilePath, 'utf8')

function StopCompileException(message) {
  this.message = 'Enough work for Flamingo Carotene. AST Received. Save time. Quit Compile! '+ message;
}
StopCompileException.prototype = new Error()

try {
  pug.compile(content, {
    filename,
    basedir: config.paths.src,
    compileDebug: false,
    plugins: [
      {
        resolve: resolveTemplatePath,
        preCodeGen(ast, options) {
          cliTools.log(`        > ${filename}`, true)
          mkdirp(path.dirname(astFile))
          const astJson = JSON.stringify(ast, null, ' ').replace(new RegExp(config.paths.src + '/', 'g'), '')
          fs.writeFileSync(targetAstFilePath, astJson)
          core.getJobmanager().incSubJobProgress('pug')
          throw new StopCompileException()
        }
      }
    ]
  })
} catch (e) {
  if (e instanceof StopCompileException) {

  } else {
    return e
  }
}

if (e) {
  console.log(`ERROR Compiling ${sourcePugFilePath}  to ${targetAstFilePath}`)
  console.log(`${e}`)
  process.exit(1);
}

process.exit(0);

