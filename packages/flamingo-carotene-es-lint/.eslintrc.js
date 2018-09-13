module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'standard',
  plugins: [
    'promise', // promise related rules - see below
  ],
  // exceptions from standard
  rules: {
      // handle errors
      'handle-callback-err': 2,
      // for a better git usage
      'comma-dangle': [1, 'only-multiline'],
      'import/first': 0,
      // let and const are safer and more verbose than var
      'no-var': 2,
      'prefer-const': 2,
      // for better readability
      'no-else-return': 1,
  },
}
