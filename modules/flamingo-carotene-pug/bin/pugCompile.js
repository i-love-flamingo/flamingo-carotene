#!/usr/bin/env node
const mkdirp = require('mkdirp-sync')
const fs = require('fs')
const path = require('path')
const pug = require('pug')

const basedir = process.argv[2]
const filename = process.argv[3]
const sourcePugFilePath = process.argv[4]
const targetAstFilePath = process.argv[5]
const nodeModulesPath = process.argv[6]

const content = fs.readFileSync(sourcePugFilePath, 'utf8')

function StopCompileException(message) {
  this.message = 'Enough work for Flamingo Carotene. AST Received. Save time. Quit Compile! '+ message;
}
StopCompileException.prototype = new Error()


const resolveTemplatePath = (filename, source, options) => {
   if (filename[0] === '~') {
    return path.join(path.join(nodeModulesPath), filename.slice(1))
  }

  return path.join(filename[0] === '/' ? options.basedir : path.dirname(source.trim()), filename)
}


let error = null

try {
  pug.compile(content, {
    filename,
    basedir: basedir,
    compileDebug: false,
    plugins: [
      {
        resolve: resolveTemplatePath,
        preCodeGen(ast, options) {
          const astJson = JSON.stringify(ast, null, ' ').replace(new RegExp(basedir + '/', 'g'), '')
          mkdirp(path.dirname(targetAstFilePath))
          fs.writeFileSync(targetAstFilePath, astJson)
          throw new StopCompileException()
        }
      }
    ]
  })
} catch (e) {
  if (e instanceof StopCompileException) {

  } else {
    error = e;
  }
}

if (error) {
  console.log(`ERROR Compiling ${sourcePugFilePath}  to ${targetAstFilePath}`)
  console.log(error)
  process.exit(1);
}

process.exit(0);

