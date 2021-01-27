module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {modules: false}
    ]
  ],
  plugins: [
    "import-glob",
    "@babel/plugin-proposal-class-properties"
  ]
}
