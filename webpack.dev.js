const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  resolve: {
    alias: {
      "sql.js": path.resolve(
        process.cwd(),
        "./node_modules/sql.js/dist/sql-wasm-debug.js"
      ),
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./node_modules/sql.js/dist/sql-wasm-debug.wasm" },
        {
          from: "./src/manifest.json",
          transform: (manifestJSON) => {
            const manifest = JSON.parse(manifestJSON);
            manifest["name"] += " (DEVELOPMENT)";
            manifest["browser_action"]["default_title"] += " (DEVELOPMENT)";
            manifest["browser_specific_settings"] = {
              gecko: { id: "@leetcache-development" },
            };
            return JSON.stringify(manifest, null, 2);
          },
        },
      ],
    }),
  ],
});
