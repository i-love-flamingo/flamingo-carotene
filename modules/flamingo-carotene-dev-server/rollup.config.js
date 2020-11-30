import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';

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
    babel()
  ],
};

export default config;
