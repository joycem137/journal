var fs = require('fs-extra');
var webpack = require('webpack');
var path = require('path');

// Fix node modules for using through webpack.
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

const OUTPUT_DIR = path.join(__dirname, 'build');

module.exports = [
    {
        entry: './server/index.js',
        target: 'node',
        output: {
            path: OUTPUT_DIR,
            filename: 'server.js'
        },
        externals: nodeModules,

        module: {
            loaders: [
                { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
                { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
                { test: /\.css$/, loader: "style-loader!css-loader" }
            ]
        },

        plugins: [
            new webpack.IgnorePlugin(/\.(css|less)$/),
            new webpack.BannerPlugin('require("source-map-support").install();',
                { raw: true, entryOnly: false })
        ],
        devtool: 'sourcemap',

        devServer: {
            contentBase: OUTPUT_DIR
        }
    },
    {
        entry: ['./client/index.jsx'],

        output: {
            path: OUTPUT_DIR,
            filename: 'client.js'
        },

        module: {
            loaders: [
                { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
                { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
                { test: /\.css$/, loader: "style-loader!css-loader" }
            ]
        },

        resolve: {
            modulesDirectories: [
                'node_modules'
            ]
        }
    }
];