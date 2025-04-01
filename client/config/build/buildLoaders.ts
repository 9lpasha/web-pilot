import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import {ModuleOptions} from 'webpack';

import {WebpackOptions} from './types';

export const buildLoaders = (options: WebpackOptions): ModuleOptions['rules'] => {
  const {isDev} = options;

  const tsLoader = {
    loader: 'ts-loader',
    options: {
      transpileOnly: isDev,
      getCustomTransformers: () => ({
        before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
      }),
    },
  };

  return [
    {
      test: /\.tsx?$/,
      use: [tsLoader],
      exclude: /node_modules/,
    },
    {
      test: /\.css$/i,
      use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
    },
    {
      test: /\.(png|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{loader: '@svgr/webpack', options: {icon: true}}],
    },
  ];
};
