const { DefinePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const path = require("path");

require("dotenv").config();
const __ServiceConfig__ = JSON.stringify(require("./service.conf.json"));

module.exports = (env) => {
  const result = {
    // eslint-disable-next-line no-undef
    entry: path.resolve(__dirname, "src/root-config"),
    output: {
      filename: "openemp-mf-root-config.js",
      libraryTarget: "system",
      // eslint-disable-next-line no-undef
      path: path.resolve(__dirname, "dist"),
    },
    devtool: "sourcemap",
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
        },
      }),
      new CleanWebpackPlugin(),
    ],
    externals: ["single-spa", /^@openemp-mf\/.+$/],
  };

  return result;
};
