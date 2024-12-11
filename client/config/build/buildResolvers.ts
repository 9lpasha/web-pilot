import {ResolveOptions} from 'webpack';
import {WebpackOptions} from './types';
import {resolve} from 'path';

export const buildResolvers = (options: WebpackOptions): ResolveOptions => {
  const {paths} = options;

  return {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': paths.src,
      '@pages': resolve(paths.src, 'pages'),
      '@widgets': resolve(paths.src, 'widgets'),
      '@features': resolve(paths.src, 'features'),
      '@entities': resolve(paths.src, 'entities'),
      '@shared': resolve(paths.src, 'shared'),
      '~shared': resolve(paths.shared),
    },
  };
};
