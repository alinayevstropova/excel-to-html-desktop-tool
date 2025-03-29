const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                "path": require.resolve("path-browserify"),
                "zlib": require.resolve("browserify-zlib"),
                "crypto": require.resolve("crypto-browserify"),
                "stream": require.resolve("stream-browserify"),
                "assert": require.resolve("assert"),
                "buffer": require.resolve("buffer"),
                "process/browser": require.resolve("process/browser"),
                "fs": false,
                "setimmediate": require.resolve("setimmediate"),
            };
            webpackConfig.plugins = [
                ...webpackConfig.plugins,
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                    Buffer: ['buffer', 'Buffer'],
                    setImmediate: ['setimmediate', 'setImmediate'],
                }),
                new NodePolyfillPlugin(),
            ];

            

            return webpackConfig;
        },
    },
};