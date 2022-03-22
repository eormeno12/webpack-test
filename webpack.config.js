const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CSSMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const DotenvWebpack = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@utils': path.resolve(__dirname, './src/utils/'),
            '@templates': path.resolve(__dirname, './src/templates/'),
            '@styles': path.resolve(__dirname, './src/styles/'),
            '@images': path.resolve(__dirname, './src/assets/images/'),
        }
    },
    module: {
        rules: [
            // Babel
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            // CSS
            {
                test: /\.css|.styl$/i,
                use: [MiniCSSExtractPlugin.loader, 
                    'css-loader',
                    'stylus-loader'
                ]
            },
            // Images
            {
                test: /\.png/,
                type: 'asset/resource'
            },
            // Fonts
            {
                test: /\.(woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[hash][ext]'
                }
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }),
        new MiniCSSExtractPlugin({
            filename: 'assets/styles/[name].[contenthash].css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src', 'assets/images'),
                    to: 'assets/images'
                }
            ]
        }),
        new DotenvWebpack(),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CSSMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
};