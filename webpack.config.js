const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/main3.ts',  
  output: {
    filename: 'main3.js',  
    path: path.resolve(__dirname, 'dist'),  
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),  
      stream: require.resolve('stream-browserify'),  
      buffer: require.resolve('buffer/'),  
      vm: require.resolve('vm-browserify'),  
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],  
      process: 'process/browser',  
    }),
  ],
  mode: 'development',
  devtool: 'inline-source-map',
};
