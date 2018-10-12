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
    rules: {},
}
