const path = require('path');
const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-ts');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackDeployAssetsPlugin = require('html-webpack-deploy-plugin');

const DotenvWebpackPlugin = require('dotenv-webpack');

const modulesImportsMap = JSON.stringify(require('./imports.map.json'));

require('dotenv').config();

module.exports = async (webpackConfigEnv, argv) => {
  const orgName = 'openemp';
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: 'root-config',
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  const externalPackages = {
    'single-spa': {
      copy: [{ from: 'lib/system', to: '/' }],
      scripts: {
        path: 'single-spa.min.js',
        devPath: 'single-spa.dev.js',
      },
    },
    react: {
      copy: [{ from: 'umd', to: '/' }],
      scripts: {
        path: 'react.production.min.js',
        devPath: 'react.development.js',
      },
    },
    'react-dom': {
      copy: [{ from: 'umd', to: '/' }],
      scripts: {
        path: 'react-dom.production.min.js',
        devPath: 'react-dom.development.js',
      },
    },
  };

  function generateImportsMap() {
    const imports = {};
    Object.keys(externalPackages).forEach((key) => {
      imports[key] = `/packages/${key}/${
        webpackConfigEnv && webpackConfigEnv.isLocal
          ? externalPackages[key].scripts.devPath
          : externalPackages[key].scripts.path
      }`;
    });
    return JSON.stringify({ imports });
  }

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new CleanWebpackPlugin(),
      new DotenvWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        scriptLoading: 'blocking',
        template: 'src/index.ejs',
        chunksSortMode: 'none',
        templateParameters: {
          packagesImportsMap: generateImportsMap(),
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          modulesImportsMap,
          modulesImportsMapUrl: process.env.IMPORTMAP_URL, // can be added from .env file
          orgName,
        },
        chunks: [],
        excludeAssets: ['packages/single-spa/single-spa.dev.js'],
      }),
      new HtmlWebpackDeployAssetsPlugin({
        getPackagePath: (packageName, packageVersion, packagePath) => path.join(packageName, packagePath),
        packages: {
          ...externalPackages,
          systemjs: {
            copy: [
              { from: 'dist', to: '/' },
              { from: 'dist/extras', to: '/extras' },
            ],
            scripts: [
              {
                path: 'system.min.js',
                devPath: 'system.js',
              },
              {
                path: 'extras/amd.min.js',
                devPath: 'extras/amd.js',
              },
            ],
          },
        },
      }),
    ],
    externals: ['single-spa', 'react-dom', 'react', new RegExp(`^@${defaultConfig.orgName}/`)],
  });
};
