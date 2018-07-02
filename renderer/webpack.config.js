const { generateWebpackConfig } = require("@simplrjs/webpack");

module.exports = generateWebpackConfig({
    devServerPort: 4000,
    entryFile: "./src/app.ts",
    outputDirectory: "../dist/renderer",
    projectDirectory: __dirname
});
