const { DefinePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");

const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

const path = require("path");

require("dotenv").config();

const __ServiceConfig__ = JSON.stringify(require("./service.conf.json"));
const openempMf = JSON.stringify(require("./src/openemp.map.json"));
const vendors = JSON.stringify(require("./src/vendors.map.json"));

module.exports = (env) => {
  const result = {
    entry: path.resolve(__dirname, "src/root-config"),
    output: {
      filename: "openemp-root-config.js",
      libraryTarget: "system",
      path: path.resolve(__dirname, "dist"),
    },
    devtool: "source-map",
    module: {
      rules: [
        { parser: { system: false } },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{ loader: "babel-loader" }],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      disableHostCheck: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      hot: true,
    },
    plugins: [
      new DotenvWebpackPlugin(),
      new DefinePlugin({
        __ServiceConfig__,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: env && env.isLocal === "true",
          openempMf,
          vendors,
        },
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: "systemjs",
            entry: [
              "dist/system.min.js",
              "dist/extras/amd.js",
              "dist/extras/named-exports.min.js",
            ],
          },
          {
            module: "react",
            entry: ["umd/react.development.js", "umd/react.production.min.js"],
          },
          {
            module: "react-dom",
            entry: [
              "umd/react-dom.development.js",
              "umd/react-dom.production.min.js",
            ],
          },
          {
            module: "@reach/router",
            entry: "umd/reach-router.min.js",
          },
          {
            module: "single-spa",
            entry: "lib/system/single-spa.min.js",
          },
          {
            module: "regenerator-runtime",
            entry: "runtime.js",
          },
          {
            module: "axios",
            entry: "dist/axios.min.js",
          },
        ],
        outputPath: "vendors",
        enabled: true,
      }),
    ],
    externals: ["single-spa", /^@openemp\/.+$/],
  };

  return result;
};
