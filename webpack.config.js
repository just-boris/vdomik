const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    dev: "./dev",
    lib: "./src"
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"]
  },
  mode: process.env.WEBPACK_MODE,
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  },
  plugins: [new HtmlWebpackPlugin({ chunks: ["dev"] })]
};

if (process.env.WEBPACK_SERVE) {
  module.exoports.serve = {
    hot: {
      // https://github.com/webpack-contrib/webpack-hot-client/pull/28
      hot: false,
      reload: true
    }
  };
}
