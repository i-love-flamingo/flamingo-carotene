module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {modules: "commonjs"}
    ]
  ],
  plugins: [
    "import-glob",
    "@babel/plugin-proposal-class-properties"
  ]
}
