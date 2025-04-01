import {Configuration as DevServerConfiguration} from 'webpack-dev-server';

import {WebpackOptions} from './types';

export const buildDevServer = (options: WebpackOptions): DevServerConfiguration | undefined => {
  const {envs, isProd} = options;

  if (isProd) return;

  return {
    port: envs.port,
    open: true,
    static: './build',
    historyApiFallback: true,
  };
};
