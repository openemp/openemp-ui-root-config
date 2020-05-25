const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const opts = {
  orgName: "openemp-mf",
  projectName: "root",
  port: 9000,
};

module.exports = (webpackConfigEnv = {}) => {
  // eslint-disable-next-line no-console
  console.log(webpackConfigEnv);
  return {
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: `http://localhost:${opts.port}/`,
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/i,
          include: [/node_modules/, /src/],
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: {
                modules: false,
              },
            },
          ],
        },
      ],
    },
    devtool: "source-map",
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      port: opts.port,
      compress: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      disableHostCheck: true,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: webpackConfigEnv.analyze ? "server" : "disabled",
      }),
      new ModuleFederationPlugin({
        name: `${opts.orgName}-${opts.projectName}.js`,
        library: { type: "var", name: `root` },
        filename: "remoteEntry.js",
        remotes: {
          "@openemp-mf/dashboard": "__openemp_mf_dashboard__",
        },
        shared: [],
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal === "true",
        },
      }),
    ],
    resolve: {
      extensions: [".js", ".mjs", ".jsx", ".wasm", ".json"],
    },
  };
};
