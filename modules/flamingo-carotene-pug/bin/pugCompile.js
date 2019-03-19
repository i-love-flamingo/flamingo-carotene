#!/usr/bin/env node
const mkdirp = require('mkdirp-sync')
const fs = require('fs')
const path = require('path')
const pug = require('pug')

const arguments = process.argv;

const runner = arguments.shift();
const selfName = arguments.shift();

const baseDir = path.resolve(process.cwd());
const sourceDir = path.resolve(baseDir, arguments.shift());
const targetDir = path.resolve(baseDir, arguments.shift());
const nodeDir = path.resolve(baseDir, arguments.shift());
const pugFilesToCompile = arguments


function StopCompileException(message) {
  this.message = 'Enough work for Flamingo Carotene. AST Received. Save time. Quit Compile! '+ message;
}
StopCompileException.prototype = new Error()


let error

for(const pugFile of pugFilesToCompile) {
  const pugFilePath = path.resolve(sourceDir, pugFile)
  let targetAstFilePath = path.resolve(targetDir, pugFile)
  targetAstFilePath = targetAstFilePath.split('.pug').join('.ast.json')
  error = compilePugFile(pugFilePath, targetAstFilePath, path.basename(pugFilePath), sourceDir, nodeDir)
  if (error) {
    break
  }
}

if (error) {
  console.log(error)
  process.exit(1);
}
process.exit(0);


function compilePugFile(sourcePugFilePath, targetAstFilePath, filename, basedir, nodeDir) {
  // console.log('compilePugFile', sourcePugFilePath, targetAstFilePath, filename, basedir, nodeDir)
  let error = null
  try {
    const content = fs.readFileSync(sourcePugFilePath, 'utf8')
    pug.compile(content, {
      filename,
      basedir: basedir,
      compileDebug: false,
      plugins: [
        {
          resolve(filename, source, options) {
            if (filename[0] === '~') {
              return path.join(path.join(nodeDir), filename.slice(1))
            }
            return path.join(filename[0] === '/' ? options.basedir : path.dirname(source.trim()), filename)
          },
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
      error = console.log(`ERROR Compiling ${sourcePugFilePath} to ${targetAstFilePath}`)
      error+= e;
    }
  }

  return error;
}
