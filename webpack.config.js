const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './templates/app.js',
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'bundle.[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './templates/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'templates/styles.css',
          to: 'styles.css'
        }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'static'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true
  }
}; 