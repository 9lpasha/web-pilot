import {Configuration} from 'webpack';
import {buildPlugins} from './buildPlugins';
import {buildDevServer} from './buildDevServer';
import {buildLoaders} from './buildLoaders';
import {buildResolvers} from './buildResolvers';
import {WebpackOptions} from './types';

export const buildWebpack = (options: WebpackOptions): Configuration => {
  const {mode, isDev, paths} = options;

  return {
    mode,
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: '[name].[contenthash:8].js',
      clean: true,
    },
    plugins: buildPlugins(options),
    devServer: buildDevServer(options),
    optimization: isDev
      ? {
          runtimeChunk: 'single',
        }
      : undefined,
    devtool: isDev ? 'inline-source-map' : false,
    module: {
      rules: buildLoaders(options),
    },
    target: 'browserslist',
    resolve: buildResolvers(options),
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};
