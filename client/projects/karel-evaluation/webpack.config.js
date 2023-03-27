// Webpack is used only for bundling the Karel evaluation library for server challenge evaluation.

const path = require("path");
const CircularDependencyPlugin = require("circular-dependency-plugin")

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
    externals: {
        karel: "karel"
    },
    output: {
        filename: "karel-evaluation.js",
        path: path.resolve(__dirname, "dist"),
        library: "karelEvaluation"
    },
    plugins: [
        new CircularDependencyPlugin({
            onDetected({ module: webpackModuleRecord, paths, compilation }) {
                compilation.errors.push(new Error(paths.join(" -> ")))
            }
        })
    ]
};