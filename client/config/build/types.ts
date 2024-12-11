export type WebpackRunMode = 'development' | 'production';

export type AppEnvironment = 'app' | 'jest';

export type AppEnvs = {
  __IS_DEV__: string;
  __IS_PROD__: string;
  __ENVIRONMENT__: AppEnvironment;
};

export type WebpackEnvs = {
  mode: WebpackRunMode;
  environment: AppEnvironment;
  port: number;
  isBundleAnalyzer: boolean;
};

export type WebpackPaths = {
  entry: string;
  output: string;
  html: string;
  src: string;
  public: string;
  shared: string;
};

export type WebpackOptions = {
  envs: WebpackEnvs;
  mode: WebpackRunMode;
  environment: AppEnvironment;
  port: number;
  isBundleAnalyzer: boolean;
  paths: WebpackPaths;
  isDev: boolean;
  isProd: boolean;
};
