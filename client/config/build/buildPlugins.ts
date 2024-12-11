import {DefinePlugin, ProgressPlugin, WebpackPluginInstance} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import {AppEnvironment, AppEnvs, WebpackOptions} from './types';
import {resolve} from 'path';

export const buildPlugins = (options: WebpackOptions): WebpackPluginInstance[] => {
  const {isDev, isProd, environment, isBundleAnalyzer, paths} = options;

  const appEnvs: AppEnvs = {
    __IS_DEV__: JSON.stringify(isDev),
    __IS_PROD__: JSON.stringify(isProd),
    __ENVIRONMENT__: JSON.stringify(environment) as AppEnvironment,
  };

  const plugins: WebpackPluginInstance[] = [
    new HtmlWebpackPlugin({template: paths.html, favicon: resolve(paths.public, 'favicon.ico')}),
    new DefinePlugin(appEnvs),
  ];

  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].css',
      }),
    );
  }

  if (isProd && isBundleAnalyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  if (isDev) {
    plugins.push(new ProgressPlugin());
    plugins.push(new ForkTsCheckerWebpackPlugin());
    plugins.push(new ReactRefreshWebpackPlugin());
  }

  return plugins;
};
