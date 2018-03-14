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
  plugins: [new HtmlWebpackPlugin()]
};
