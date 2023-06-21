module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { modules: 'commonjs' }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-class-properties'
  ]
}
