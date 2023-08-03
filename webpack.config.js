// webpack.config.js
const path = require('path');

module.exports = {
  entry: './app/javascript/application.js',
  output: {
    path: path.resolve(__dirname, 'public', 'packs'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
