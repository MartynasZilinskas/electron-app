const { generateWebpackConfig } = require("@simplrjs/webpack");

const config = generateWebpackConfig({
    devServerPort: 4000,
    entryFile: "./src/app.ts",
    outputDirectory: "../dist/renderer",
    projectDirectory: __dirname
});

config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)\/(webpack-dev-server)/
});

module.exports = config;
