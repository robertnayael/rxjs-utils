const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';

module.exports = {
    entry: ['@babel/polyfill', './src/index.ts'],
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'build')
    },
    mode: isProduction ? 'production' : 'development',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        port: 9000,
        overlay: {
            warnings: false,
            errors: true
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    'ts-loader'
                ]
            }
        ],
    },
    plugins: [
        new WriteFilePlugin(),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['build/**/*'],
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src/static'),
                to: path.join(__dirname, 'build')
            }
        ])
    ],
    performance: {
        hints: false
    }
};