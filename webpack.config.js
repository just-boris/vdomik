const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./dev",
  resolve: {
    extensions: [".js", ".tsx", ".ts"]
  },
  mode: 'development',
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  },
  plugins: [new HtmlWebpackPlugin()],
  serve: {
    hot: {
      // https://github.com/webpack-contrib/webpack-hot-client/pull/28
      hot: false,
      reload: true
    }
  }
};
