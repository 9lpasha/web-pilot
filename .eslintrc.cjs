module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:import/warnings',
  ],
  ignorePatterns: ['.eslintrc.cjs', 'client/build/**/*', 'server/build/**/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-refresh', 'react-hooks', '@typescript-eslint', 'prettier'],
  settings: {
    'import/internal-regex': '^(~|@)',
    'import/index-regex': 'index',
  },
  rules: {
    'prettier/prettier': 1,
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
    'prefer-rest-params': 0,
    '@typescript-eslint/no-unsafe-declaration-merging': 0,
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': 'off',
    'import/no-named-as-default': 'off',
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/newline-after-import': 'warn',
    'react/react-in-jsx-scope': 'off',
  },
};
