const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { version } = require("./package.json");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  resolve: {
    alias: {
      "sql.js": path.resolve(
        process.cwd(),
        "./node_modules/sql.js/dist/sql-wasm.js"
      ),
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./node_modules/sql.js/dist/sql-wasm.wasm" },
        {
          from: "./src/manifest.json",
          transform: (manifestJSON) => {
            const manifest = JSON.parse(manifestJSON);
            manifest["version"] = version;
            return JSON.stringify(manifest, null, 2);
          },
        },
      ],
    }),
  ],
});
