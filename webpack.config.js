const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEBUG = process.env.DEBUG === 'false' ? false : true;

const config = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src")
                ],
                options: {
                    presets: ["es2015"]
                },
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: "css-loader"
                })
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'PRODUCTION': JSON.stringify(IS_PROD),
            'DEBUG': JSON.stringify(IS_DEBUG)
        }),
        new ExtractTextPlugin({
            filename: 'bundle.css',
            allChunks: true,
        }),
        new HtmlWebpackPlugin()
    ]
}

if (IS_DEV) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.devtool = 'inline-source-map';
    config.devServer = {
        contentBase: path.join(__dirname, "dist")
    };
}

if (IS_PROD) {
    config.plugins.push(new UglifyJsPlugin());
}

module.exports = config;