import babel from 'rollup-plugin-babel';

const config = {
  input: 'client/socketClient.js',
  output: [
    {
      file: 'dist/socketClient.js',
      format: 'iife',
    },
  ],
  plugins: [babel()],
};

export default config;
