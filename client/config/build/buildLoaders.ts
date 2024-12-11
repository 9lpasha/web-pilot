import {ModuleOptions} from 'webpack';
import {WebpackOptions} from './types';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshTypeScript from 'react-refresh-typescript';

export const buildLoaders = (options: WebpackOptions): ModuleOptions['rules'] => {
  const {isDev} = options;

  const cssLoaderWithModules = {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]',
      },
    },
  };

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
      use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, cssLoaderWithModules],
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
