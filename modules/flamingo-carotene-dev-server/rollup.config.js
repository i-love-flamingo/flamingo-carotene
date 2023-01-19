const nodeResolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel');
const sass = require('rollup-plugin-sass');

const config = {
  input: 'client/socketClient.js',
  output: [
    {
      file: 'dist/socketClient.js',
      format: 'iife',
    },
  ],
  plugins: [
    nodeResolve({
      browser: true
    }),
    babel({
      babelHelpers: "bundled"
    }),
    sass({
      output: true
    })
  ],
};

module.exports = config
