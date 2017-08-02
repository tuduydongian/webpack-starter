const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEBUG = process.env.DEBUG !== 'false';

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
        ],
        options: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
          ],
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(IS_PROD),
      DEBUG: JSON.stringify(IS_DEBUG),
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin(),
  ],
};

if (IS_DEV) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.devtool = 'inline-source-map';
  config.devServer = {
    contentBase: path.join(__dirname, 'build'),
  };
}

if (IS_PROD) {
  config.plugins.push(new UglifyJsPlugin());
}

module.exports = config;
