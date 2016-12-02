var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.jsx'
  ],
  module:{
    loaders:[
      {
        test: /\.js$|.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: __dirname,
    filename: 'dist/bundle.js',
    publicPath: '/'
  },
  stats: {
    colors: true
  },
  devServer: {
      contentBase: './dist',
      hot:true
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ],
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  }
}