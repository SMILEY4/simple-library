const path = require('path');
const rules = require('./webpack.rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rendererConfig = {
    mode: 'production',
    target: 'electron-renderer',
    entry: ['./src/renderer/index.tsx'],
    node: {
        __dirname: true
    },
    module: {
        rules: [
            {
                test: /\.(j|t)s(x)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: true,
                    },
                },
            },
            ...rules,
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        sharp: 'commonjs sharp',
        sqlite3: 'commonjs sqlite3' //Sqlite3 won't work without this line.
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '.webpack', 'renderer'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, 'public', 'index.html'),
            inject: true,
        }),
    ],
};

const mainConfig = {
    mode: 'production',
    target: 'electron-main',
    entry: './src/main/index.ts',
    node: {
        __dirname: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            ...rules,
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        sharp: 'commonjs sharp',
        sqlite3: 'commonjs sqlite3' //Sqlite3 won't work without this line.
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '.webpack', 'main'),
    },
};

module.exports = [rendererConfig, mainConfig];
