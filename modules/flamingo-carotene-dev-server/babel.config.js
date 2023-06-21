module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {modules: false}
    ]
  ],
  exclude: /node_modules\/(css-loader)/,
  plugins: [
    "import-glob",
    "@babel/plugin-transform-class-properties"
  ]
}
