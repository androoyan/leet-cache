const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    background: "./src/background/index.ts",
    contentScript: "./src/content/index.ts",
    edit: "./src/popup/pages/Edit/index.tsx",
    options: "./src/options/index.tsx",
    popup: "./src/popup/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      crypto: false,
      fs: false,
      path: false,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ["edit"],
      filename: "edit.html",
      template: "./src/popup/pages/Edit/index.html",
    }),
    new HtmlWebpackPlugin({
      chunks: ["options"],
      filename: "options.html",
      template: "./src/options/index.html",
    }),
    new HtmlWebpackPlugin({
      chunks: ["popup"],
      filename: "popup.html",
      template: "./src/popup/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./src/assets", to: "assets" }],
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].bundle.js",
    clean: true,
  },
};
