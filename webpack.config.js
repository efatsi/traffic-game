const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },

      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
    })
  ],
};
