import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sass from 'rollup-plugin-sass';

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
    babel(),
    sass({
      output: true
    })
  ],
};

export default config;
