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
      'no-else-return': 2,
      // in Vue it’s common to use the keyword new without the need to store the constructed object
      'no-new': 0,
      // promise related rules - for more info on why that’s a good idea see
      // http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
      'promise/param-names': 2,
      'promise/no-return-wrap': 2,
      'promise/catch-or-return': 2,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
}
