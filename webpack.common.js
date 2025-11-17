const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

module.exports = {
  entry: path.resolve(__dirname, "src", "app.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("tailwindcss"), require("autoprefixer")],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      minify: false,
      filename: "index.html",
    }),
    // Generate HTML files for pages
    ...fs.readdirSync(path.resolve(__dirname, "src", "pages")).map(
      (file) =>
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "src", "pages", file),
          minify: false,
          filename: `pages/${file}`,
        })
    ),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src", "assets"), to: "assets" },
      ],
    }),
  ],
  resolve: {
    extensions: [".js"],
  },
};
