const path = require("path");
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
    entry: "./src/public-api.ts",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        library: "karel"
    },
    plugins: [
        new CircularDependencyPlugin({
            onDetected({ module: webpackModuleRecord, paths, compilation }) {
                compilation.errors.push(new Error(paths.join(' -> ')))
            }
        })
    ]
};