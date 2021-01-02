const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')

const electronConfiguration = {
  mode: 'development',
  entry: './src/main.ts',
  target: 'electron-main',
  resolve: { // => no need to navigate to folder with '../../' -> use @ as starting point in 'src'
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: /src/,
      use: [{loader: 'ts-loader'}]
    }]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'main.js'
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: 'src/assets',
        to: 'assets'
      }]
    })
  ]
};

const reactConfiguration = {
  mode: 'development',
  entry: './src/renderer.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  resolve: {
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      include: /src/,
      use: [{loader: 'ts-loader'}]
    }]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'renderer.js'
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
}

module.exports = [
  electronConfiguration,
  reactConfiguration
];
