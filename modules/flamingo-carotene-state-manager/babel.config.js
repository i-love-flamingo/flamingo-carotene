module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {modules: "commonjs"}
    ]
  ],
  plugins: [
    "import-glob",
    "@babel/plugin-transform-class-properties"
  ]
}
