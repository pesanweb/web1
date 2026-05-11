const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      __BASE_URL__: JSON.stringify('/v1'),
    }),
  ],
});
